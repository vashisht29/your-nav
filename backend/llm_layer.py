# backend/llm_layer.py

import os
import requests
import json

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def generate_itinerary_explanation(itinerary, persona_name, lang="en"):
    """
    Calls the Gemini API to explain the finalized itinerary.
    Bilingual: English (en) or Hindi (hi)
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Extract key variables for the prompt
    hotel_name = itinerary.get("selected_hotel", {}).get("name", "N/A")
    hotel_rating = itinerary.get("selected_hotel", {}).get("star_rating", "N/A")
    hotel_cost = itinerary.get("selected_hotel", {}).get("cost_inr", "N/A")
    total_cost = itinerary.get("total_cost_inr", 0.0)
    
    activities_summary = []
    for day in itinerary.get("days", []):
        day_num = day["day_number"]
        sch = [f"{a['name']} ({a['start_time']} - {a['end_time']})" for a in day["schedule"]]
        activities_summary.append(f"Day {day_num}: " + ", ".join(sch))
        
    activities_str = "\n".join(activities_summary)
    
    # Construct Prompts based on selected language
    if lang == "hi":
        prompt = f"""
        आप एक बुद्धिमान AI ट्रैवल प्लानर और गाइड हैं।
        कृपया निम्नलिखित यात्रा कार्यक्रम (itinerary) को स्पष्ट करें और समझाएं कि यह यात्रा किस प्रकार सर्वश्रेष्ठ है।
        
        उपयोगकर्ता की श्रेणी: {persona_name}
        कुल बजट खर्च: ₹{total_cost}
        चुना गया होटल: {hotel_name} (स्टार रेटिंग: {hotel_rating}, प्रति रात मूल्य: ₹{hotel_cost})
        
        दैनिक गतिविधियां:
        {activities_str}
        
        कृपया निम्नलिखित बिंदुओं को ध्यान में रखते हुए एक सुंदर, विनम्र और आकर्षक विवरण हिंदी (Hindi) में लिखें:
        1. यह होटल उपयोगकर्ता की {persona_name} श्रेणी के अनुकूल क्यों है।
        2. चुनी गई गतिविधियों का क्रम और समय की उपयोगिता क्यों बेहतर है।
        3. कुल बजट की बचत और समय प्रबंधन के विषय में बताएं।
        """
    else:
        prompt = f"""
        You are an intelligent, friendly AI Travel Planner.
        Please review the following travel itinerary and provide a clear, engaging explanation of why this plan was optimized for the traveler.
        
        User Persona Category: {persona_name}
        Total Cost: INR {total_cost}
        Selected Hotel: {hotel_name} (Rating: {hotel_rating} stars, Nightly Rate: INR {hotel_cost})
        
        Daily Schedule:
        {activities_str}
        
        Provide a polite, structured description in English covering:
        1. Why the selected hotel fits their '{persona_name}' persona.
        2. How the activity timing and order ensures smooth travel (no overlaps, optimal transit).
        3. A summary of cost efficiency and budget utilization.
        """

    if not api_key:
        # Fallback response if API key is not present (for sandbox/demo robustness)
        if lang == "hi":
            return f"**नमस्ते!** आपके यात्रा कार्यक्रम का विवरण तैयार है। हमने आपके लिए **{hotel_name}** चुना है जो आपके **{persona_name}** बजट के बिलकुल अनुकूल है। दैनिक योजना समय सारिणी के अनुसार बनाई गई है ताकि कोई ओवरलैप न हो। आपकी कुल यात्रा का बजट ₹{total_cost} के अंतर्गत है।"
        else:
            return f"**Hello!** Your itinerary explanation is ready. We selected **{hotel_name}** which aligns perfectly with your **{persona_name}** profile. The daily schedules have been resolved to fit within opening hours. Your trip fits well under the budget limit with a total cost of INR {total_cost}."

    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            headers=headers,
            data=json.dumps(payload),
            timeout=10
        )
        if response.status_code == 200:
            res_json = response.json()
            explanation = res_json["candidates"][0]["content"]["parts"][0]["text"]
            return explanation
        else:
            # Fallback on HTTP error
            return f"Error: Received status {response.status_code} from Gemini. (Alternative: {hotel_name} selected for your {persona_name} trip, total cost INR {total_cost})."
    except Exception as e:
        return f"Could not connect to Gemini API. (Alternative: {hotel_name} selected for your {persona_name} trip, total cost INR {total_cost})."
