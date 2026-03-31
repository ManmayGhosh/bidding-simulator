import random
import uuid

class WebPublisherSimulator:
    def __init__(self):
        self.categories = ["Finance", "Tech", "Gaming", "Health", "Automotive", "Travel"]
        self.formats = ["Video Unit", "Interstitial", "Native Feed", "Sticky Anchor", "Standard Display"]
        self.geo_types = ["Localized Radius", "National Geotargeting", "Tier-1 Global"]
        self.targeting = ["Contextual Keyword", "Site Retargeting", "Search Intent", "Predictive Behavioral", "Geofenced Proximity"]
        self.placements = ["Above the Fold", "In-Feed", "Sticky Footer", "Sidebar", "Bottom of Page"]
        self.devices = ["Mobile (iOS)", "Mobile (Android)", "Desktop"]

    def generate_bid_request(self):
        # 1. Select the 6 Features
        cat = random.choice(self.categories)
        fmt = random.choice(self.formats)
        place = random.choice(self.placements)
        dev = random.choice(self.devices)
        interest = round(random.uniform(0.1, 0.98), 4)
        view = round(random.uniform(0.4, 0.99), 2)

        # 2. Weighted Probability Calculation (The "Hidden" RL Environment)
        # Baseline probability of 0.05 (1/20) as requested
        prob = 0.05

        # Feature Weights
        if cat in ["Finance", "Tech"]: prob += 0.08
        if fmt in ["Video Unit", "Interstitial"]: prob += 0.12
        if place == "Above the Fold": prob += 0.05
        if "Mobile" in dev: prob += 0.05
        
        # Continuous Variables
        prob += (interest * 0.10)
        prob += (view * 0.05)

        return {
            "request_id": str(uuid.uuid4())[:8],
            "page_category": cat,
            "ad_format": fmt,
            "ad_slot_size": random.choice(["728x90", "300x250", "160x600"]),
            "geo_country": random.choice(["USA", "UK", "IND", "GER", "CAN"]),
            "location_type": random.choice(self.geo_types),
            "targeting_type": random.choice(self.targeting),
            "device_type": dev,
            "connection_speed": random.choice(["5G Ultra", "Home WiFi", "4G LTE"]),
            "user_interest_score": interest,
            "viewability_score": view,
            "seo_score": round(random.uniform(0.5, 1.0), 2),
            "placement": place,
            "true_click_prob": round(min(prob, 0.60), 2) # Capped at 60% for realism
        }