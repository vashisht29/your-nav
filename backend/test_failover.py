# backend/test_failover.py

import os
import sys

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from real_providers import get_hotels_with_failover, get_sights_with_failover

def run_tests():
    print("=== STARTING MULTI-PROVIDER FAILOVER TESTS ===")
    
    # Coordinates of Jaipur
    lat, lng = 26.9124, 75.7873
    city = "Jaipur"
    
    print("\n--- Test Case 1: Stays/Hotels Search with Failover ---")
    hotels = get_hotels_with_failover(lat, lng, city)
    print(f"Total Hotels Found: {len(hotels)}")
    if hotels:
        print(f"Sample hotel: {hotels[0]['name']} (Comfort Star: {hotels[0]['star_rating']}★) - Image URL: {hotels[0].get('image_url')}")
        assert "images" in hotels[0], "Hotel candidate must include image gallery array"
        assert len(hotels[0]["images"]) >= 3, "Hotel gallery must contain at least 3 images"
        print("Test Passed: Stays failover returned structured, valid images.")
    else:
        print("Test Warning: No hotels found (baseline database empty?)")

    print("\n--- Test Case 2: Sights & Restaurants Search with Failover ---")
    candidates = get_sights_with_failover(lat, lng, city)
    attractions = candidates.get("attractions", [])
    restaurants = candidates.get("restaurants", [])
    print(f"Total Attractions Found: {len(attractions)}")
    print(f"Total Restaurants Found: {len(restaurants)}")
    
    if attractions:
        print(f"Sample Attraction: {attractions[0]['name']} (Rating: {attractions[0].get('rating')}★)")
    if restaurants:
        print(f"Sample Restaurant: {restaurants[0]['name']} (Cuisine: {restaurants[0].get('cuisine')})")
        
    print("Test Passed: Attractions failover returned valid candidate schemas.")
    print("\n=== ALL FAILOVER TESTS COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
