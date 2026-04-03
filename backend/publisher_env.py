import random
import uuid

class WebPublisherSimulator:
    def __init__(self):
        # Expanded Core Features
        self.categories = [
            "Finance", "Tech", "Gaming", "Health", "Automotive", "Travel", 
            "Real Estate", "E-commerce", "Education", "Entertainment", 
            "Food & Drink", "Sports", "Fashion", "News", "Lifestyle"
        ]
        self.formats = [
            "Video Unit", "Interstitial", "Native Feed", "Sticky Anchor", 
            "Standard Display", "Rewarded Video", "Parallax Scroll", 
            "Carousel Ad", "Lightbox", "Expandable Banner"
        ]
        self.placements = [
            "Above the Fold", "In-Feed", "Sticky Footer", "Sidebar", 
            "Bottom of Page", "Middle Article", "Interstitial Overlay", 
            "Background Skin", "Video Pre-roll", "Comment Section"
        ]
        self.devices = [
            "Mobile (iOS)", "Mobile (Android)", "Desktop", "Tablet", 
            "Smart TV", "Wearable", "Gaming Console"
        ]
        
        # Expanded Demographic & Geographic Pools
        self.age_groups = [
            "Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
        ]
        self.genders = ["Male", "Female", "Non-Binary", "Undisclosed"]
        self.regions = [
            "North America", "Europe", "APAC", "LATAM", "MENA", 
            "Sub-Saharan Africa", "Oceania"
        ]
        self.cities = [
            "New York", "London", "Tokyo", "Berlin", "Mumbai", "Paris",
            "Singapore", "Sydney", "Dubai", "New Delhi", "Toronto", "Seoul",
            "London", "Barcelona", "Amsterdam", "Mexico City", "Chicago"
        ]

    def generate_bid_request(self):
        # Select observable factual features
        cat = random.choice(self.categories)
        fmt = random.choice(self.formats)
        place = random.choice(self.placements)
        dev = random.choice(self.devices)
        
        age = random.choice(self.age_groups)
        gender = random.choice(self.genders)
        region = random.choice(self.regions)
        city = random.choice(self.cities)

        # Hidden RL States (Remain hidden from UI for "Blind Auction" logic)
        interest = round(random.uniform(0.1, 0.95), 4)
        view = round(random.uniform(0.4, 0.90), 2)

        # Enterprise interval data
        interval_days = random.choice([90, 180, 360]) 
        daily_traffic = random.randint(500, 2500) 

        # Click probability influenced by new diverse features
        prob = 0.005 
        if cat in ["Finance", "Tech", "Real Estate"]: prob += 0.012
        if age in ["25-34", "35-44"]: prob += 0.008
        if fmt == "Rewarded Video": prob += 0.015
        if region in ["North America", "Europe"]: prob += 0.005
        prob += (interest * 0.02)

        return {
            "request_id": str(uuid.uuid4())[:8],
            "page_category": cat,
            "ad_format": fmt,
            "placement": place,
            "device_type": dev,
            "demographic_age": age,
            "demographic_gender": gender,
            "geo_region": region,
            "geo_city": city,
            "user_interest_score": interest, 
            "viewability_score": view,        
            "true_click_prob": round(min(prob, 0.08), 4),
            "hidden_interval": interval_days,
            "hidden_daily_traffic": daily_traffic
        }