# backend/ml_pipeline.py

import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from sklearn.cluster import KMeans
from catboost import CatBoostRegressor

# 1. XGBoost Price Imputation
class PriceImputer:
    def __init__(self):
        self.model = XGBRegressor(n_estimators=30, max_depth=3, learning_rate=0.1)
        self.is_trained = False

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
        if len(records) > 2:
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
            0: "Budget Saver",
            1: "Luxury Traveler",
            2: "Fast Explorer",
            3: "Family Relaxed"
        }
        self.weights = {
            "Budget Saver": {"price_ratio": 2.0, "rating": 0.5, "tag_overlap": 1.0, "dist_to_center": 1.0},
            "Luxury Traveler": {"price_ratio": 0.3, "rating": 2.0, "tag_overlap": 1.0, "dist_to_center": 1.0},
            "Fast Explorer": {"price_ratio": 1.0, "rating": 1.0, "tag_overlap": 2.2, "dist_to_center": 0.5},
            "Family Relaxed": {"price_ratio": 1.0, "rating": 1.2, "tag_overlap": 1.0, "dist_to_center": 1.5}
        }

    def predict_persona(self, user_vector):
        cluster_id = int(self.kmeans.predict([user_vector])[0])
        name = self.personas[cluster_id]
        return name, self.weights[name]

# 4. CatBoost Ranker
class CatBoostRanker:
    def __init__(self):
        self.hotel_ranker = CatBoostRegressor(iterations=15, depth=3, learning_rate=0.1, verbose=0)
        self.attraction_ranker = CatBoostRegressor(iterations=15, depth=3, learning_rate=0.1, verbose=0)

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

        df = pd.DataFrame(candidates)
        features = ["price_ratio", "rating", "tag_overlap", "dist_to_center"]

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
