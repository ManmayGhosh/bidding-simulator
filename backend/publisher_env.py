import random
import uuid

class WebPublisherSimulator:
    def __init__(self):
        self.categories = ["Finance", "Tech", "Gaming", "Health", "Automotive", "Travel"]
        # Dimensions for your MerchCard components
        self.formats = ["Standard Display", "Sticky Anchor", "Interstitial", "Native Feed", "Video Unit"]
        self.geo_types = ["Localized Radius", "National Geotargeting", "Tier-1 Global"]
        self.targeting = ["Contextual Keyword", "Site Retargeting", "Search Intent", "Predictive Behavioral", "Geofenced Proximity"]
        self.placements = ["Above the Fold", "In-Feed", "Sticky Footer", "Sidebar"]

    def generate_bid_request(self):
        place = random.choice(self.placements)
        # Probability for the Reward Engine
        probs = {"Above the Fold": 0.08, "In-Feed": 0.05, "Sticky Footer": 0.04, "Sidebar": 0.02}
        
        return {
            "request_id": str(uuid.uuid4())[:8],
            "ad_format": random.choice(self.formats),
            "ad_slot_size": random.choice(["728x90", "300x250", "160x600"]),
            "geo_country": random.choice(["USA", "UK", "IND", "GER", "CAN"]),
            "location_type": random.choice(self.geo_types),
            "targeting_type": random.choice(self.targeting),
            "device_type": random.choice(["Mobile (iOS)", "Mobile (Android)", "Desktop"]),
            "connection_speed": random.choice(["5G Ultra", "Home WiFi", "4G LTE"]),
            "page_category": random.choice(self.categories),
            "user_interest_score": round(random.uniform(0.1, 0.98), 4),
            "viewability_score": round(random.uniform(0.4, 0.99), 2),
            "seo_score": round(random.uniform(0.5, 1.0), 2),
            "placement": place,
            "true_click_prob": probs[place]
        }