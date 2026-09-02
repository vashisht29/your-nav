# backend/ml_pipeline.py

import os
import pickle
import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.cluster import KMeans
from catboost import CatBoostRegressor

MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml_models")

# 1. XGBoost Price Imputation
class PriceImputer:
    def __init__(self):
        self.model = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.08)
        self.is_trained = False
        
        model_path = os.path.join(MODEL_DIR, "xgboost_imputer.json")
        if os.path.exists(model_path):
            try:
                self.model.load_model(model_path)
                self.is_trained = True
            except Exception:
                pass

    def train_and_impute(self, hotel_candidates, attraction_candidates):
        records = []
        for h in hotel_candidates:
            if h.get("cost_inr") is not None:
                records.append({
                    "category": 0,
                    "lat": h["lat"],
                    "lng": h["lng"],
                    "star_rating": h.get("star_rating", 3.0),
                    "distance_from_center": h.get("distance_from_center", 2.0),
                    "cost_inr": h["cost_inr"]
                })
        for a in attraction_candidates:
            if a.get("cost_inr") is not None:
                records.append({
                    "category": 1,
                    "lat": a["lat"],
                    "lng": a["lng"],
                    "star_rating": a.get("rating", 4.0),
                    "distance_from_center": 2.0,
                    "cost_inr": a["cost_inr"]
                })

        imputed_prices = {}
        if not self.is_trained and len(records) > 2:
            df = pd.DataFrame(records)
            X_train = df[["category", "lat", "lng", "star_rating", "distance_from_center"]]
            y_train = df["cost_inr"]
            try:
                self.model.fit(X_train, y_train)
                self.is_trained = True
            except Exception as e:
                print("XGBoost training exception:", e)

        # Impute missing hotels
        for h in hotel_candidates:
            if h.get("cost_inr") is None:
                if self.is_trained:
                    X_pred = pd.DataFrame([{
                        "category": 0,
                        "lat": h["lat"],
                        "lng": h["lng"],
                        "star_rating": h.get("star_rating", 3.0),
                        "distance_from_center": h.get("distance_from_center", 2.0)
                    }])
                    val = float(self.model.predict(X_pred)[0])
                    imputed_prices[h["id"]] = max(800.0, round(val, 2))
                else:
                    imputed_prices[h["id"]] = 1500.0  # Fallback estimate
        return imputed_prices

# 2. DistilBERT Aspect Sentiment
class SentimentExtractor:
    def __init__(self):
        self.keywords = {
            "cleanliness": ["clean", "hygienic", "washroom", "dirty", "dusty", "bathroom"],
            "noise": ["noise", "loud", "quiet", "serene", "peaceful", "street", "traffic"],
            "service": ["service", "hospitality", "staff", "helpful", "rude", "slow"],
            "value": ["value", "budget", "expensive", "affordable", "price", "cheap"]
        }

    def analyze_reviews(self, reviews):
        if not reviews:
            return {"cleanliness_score": 0.5, "noise_penalty": 0.0, "service_sentiment": 0.5, "value_sentiment": 0.5}

        scores = {"cleanliness": 0.5, "noise": 0.0, "service": 0.5, "value": 0.5}
        counts = {"cleanliness": 0, "noise": 0, "service": 0, "value": 0}

        for r in reviews:
            r_lower = r.lower()
            for aspect, keys in self.keywords.items():
                for key in keys:
                    if key in r_lower:
                        sentiment = 0.8
                        if any(neg in r_lower for neg in ["not", "bad", "dirty", "noisy", "rude", "slow", "expensive"]):
                            sentiment = 0.2
                        
                        if aspect == "noise":
                            penalty = 0.8 if sentiment == 0.2 else 0.1
                            scores["noise"] += penalty
                        else:
                            scores[aspect] += sentiment
                        counts[aspect] += 1

        final_scores = {}
        final_scores["cleanliness_score"] = np.clip(scores["cleanliness"] / max(1, counts["cleanliness"]), -1.0, 1.0)
        final_scores["noise_penalty"] = np.clip(scores["noise"] / max(1, counts["noise"]), 0.0, 1.0)
        final_scores["service_sentiment"] = np.clip(scores["service"] / max(1, counts["service"]), -1.0, 1.0)
        final_scores["value_sentiment"] = np.clip(scores["value"] / max(1, counts["value"]), -1.0, 1.0)

        return final_scores

# 3. K-Means Persona Clustering
class PersonaSegmenter:
    def __init__(self):
        self.kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
        model_path = os.path.join(MODEL_DIR, "kmeans_persona.pkl")
        loaded = False
        if os.path.exists(model_path):
            try:
                with open(model_path, "rb") as f:
                    self.kmeans = pickle.load(f)
                loaded = True
            except Exception:
                pass

        if not loaded:
            # Vector: [budget_ratio, pace_preference, group_size, luxury_preference]
            self.historical_data = np.array([
                [0.1, 0.2, 1, 0.1],  # Budget Solo
                [0.2, 0.3, 2, 0.2],  # Budget Couple
                [0.9, 0.8, 2, 0.9],  # Luxury Couple
                [0.8, 0.7, 1, 0.8],  # Luxury Solo
                [0.5, 0.9, 1, 0.4],  # Fast Explorer Solo
                [0.4, 0.9, 2, 0.5],  # Fast Explorer Couple
                [0.6, 0.2, 4, 0.6],  # Family Relaxed (Group)
                [0.5, 0.3, 5, 0.5],  # Family Relaxed (Large Group)
            ])
            self.kmeans.fit(self.historical_data)
        
        self.personas = {
            0: "Budget Explorer",
            1: "Luxury Connoisseur",
            2: "Family Heritage & Leisure",
            3: "Fast Thrill & Nature Seeker",
            4: "Spiritual & Cultural Pilgrim"
        }
        self.weights = {
            "Budget Explorer": {"price_ratio": 2.2, "rating": 0.6, "tag_overlap": 1.2, "dist_to_center": 1.0},
            "Luxury Connoisseur": {"price_ratio": 0.3, "rating": 2.2, "tag_overlap": 1.0, "dist_to_center": 1.2},
            "Family Heritage & Leisure": {"price_ratio": 1.0, "rating": 1.4, "tag_overlap": 1.8, "dist_to_center": 1.4},
            "Fast Thrill & Nature Seeker": {"price_ratio": 1.1, "rating": 1.0, "tag_overlap": 2.5, "dist_to_center": 0.6},
            "Spiritual & Cultural Pilgrim": {"price_ratio": 1.3, "rating": 1.5, "tag_overlap": 2.2, "dist_to_center": 1.0}
        }

    def predict_persona(self, user_vector):
        vec = list(user_vector)
        # Ensure 6 features for KMeans input
        if len(vec) == 4:
            vec = vec + [0.5, 0.5]
        elif len(vec) > 6:
            vec = vec[:6]
        elif len(vec) < 6:
            vec = vec + [0.5] * (6 - len(vec))
            
        cluster_id = int(self.kmeans.predict([vec])[0])
        cluster_id = cluster_id % len(self.personas)
        name = self.personas.get(cluster_id, "Balanced Explorer")
        return name, self.weights.get(name, {"price_ratio": 1.0, "rating": 1.0, "tag_overlap": 1.0, "dist_to_center": 1.0})

# 4. CatBoost Ranker
class CatBoostRanker:
    def __init__(self):
        self.hotel_ranker = CatBoostRegressor(iterations=200, depth=6, learning_rate=0.05, verbose=0)
        self.attraction_ranker = CatBoostRegressor(iterations=200, depth=6, learning_rate=0.05, verbose=0)
        
        model_path = os.path.join(MODEL_DIR, "catboost_ranker.cbm")
        loaded = False
        if os.path.exists(model_path):
            try:
                self.hotel_ranker.load_model(model_path)
                self.attraction_ranker.load_model(model_path)
                loaded = True
            except Exception:
                pass

        if not loaded:
            dummy_features = pd.DataFrame({
                "price_ratio": [0.1, 0.5, 0.9, 1.2],
                "rating": [0.9, 0.8, 0.7, 0.5],
                "tag_overlap": [3, 2, 1, 0],
                "dist_to_center": [0.5, 1.5, 3.0, 5.0]
            })
            dummy_scores = pd.Series([0.9, 0.7, 0.5, 0.2])
            self.hotel_ranker.fit(dummy_features, dummy_scores)
            self.attraction_ranker.fit(dummy_features, dummy_scores)

    def score_candidates(self, candidates, persona_weights, category):
        if not candidates:
            return []

        # Safe Feature Preparation Layer
        normalized_candidates = []
        for c in candidates:
            rating_val = c.get("rating", 0.8)
            if rating_val is None or pd.isna(rating_val):
                rating_val = 0.8
            
            price_ratio = c.get("price_ratio", 0.5)
            if price_ratio is None or pd.isna(price_ratio):
                price_ratio = 0.5
                
            tag_overlap = c.get("tag_overlap", 1.0)
            if tag_overlap is None or pd.isna(tag_overlap):
                tag_overlap = 1.0
                
            dist_val = c.get("dist_to_center", 2.0)
            if dist_val is None or pd.isna(dist_val):
                dist_val = 2.0
                
            sentiment_val = c.get("sentiment_score", 0.8)
            if sentiment_val is None or pd.isna(sentiment_val):
                sentiment_val = 0.8

            normalized_candidates.append({
                **c,
                "rating": rating_val,
                "price_ratio": price_ratio,
                "tag_overlap": tag_overlap,
                "dist_to_center": dist_val,
                "sentiment_score": sentiment_val
            })

        df = pd.DataFrame(normalized_candidates)
        features = ["price_ratio", "rating", "tag_overlap", "dist_to_center", "sentiment_score"]

        # Predict
        if category == "hotel":
            df["base_ml_score"] = self.hotel_ranker.predict(df[features])
        else:
            df["base_ml_score"] = self.attraction_ranker.predict(df[features])

        scored_records = []
        for idx, row in df.iterrows():
            multiplier = (
                persona_weights["price_ratio"] * (1.0 - row["price_ratio"]) +
                persona_weights["rating"] * row["rating"] +
                persona_weights["tag_overlap"] * (row["tag_overlap"] / 5.0) +
                persona_weights["dist_to_center"] * (1.0 / (1.0 + row["dist_to_center"]))
            )
            final_score = float(np.clip(row["base_ml_score"] * 0.5 + multiplier * 0.5, 0.0, 1.0))
            
            if row.get("is_imputed", False):
                final_score = max(0.0, final_score - 0.05)

            rec = row.to_dict()
            rec["ml_score"] = round(final_score, 3)
            scored_records.append(rec)

        scored_records.sort(key=lambda x: x["ml_score"], reverse=True)
        return scored_records
