import random
import uuid

class WebPublisherSimulator:
    def __init__(self):
        self.categories = ["Finance", "Tech", "Gaming", "Health", "Automotive", "Travel"]
        self.formats = ["Video Unit", "Interstitial", "Native Feed", "Sticky Anchor", "Standard Display"]
        self.placements = ["Above the Fold", "In-Feed", "Sticky Footer", "Sidebar", "Bottom of Page"]
        self.devices = ["Mobile (iOS)", "Mobile (Android)", "Desktop"]

    def generate_bid_request(self):
        cat = random.choice(self.categories)
        fmt = random.choice(self.formats)
        place = random.choice(self.placements)
        dev = random.choice(self.devices)
        interest = round(random.uniform(0.1, 0.95), 4)
        view = round(random.uniform(0.4, 0.90), 2)

        # 90, 180, or 360 day Enterprise Intervals
        interval_days = random.choice([90, 180, 360]) 
        daily_traffic = random.randint(500, 2500) 

        # Click Probability Logic
        prob = 0.005 
        if cat in ["Finance", "Tech"]: prob += 0.008
        if fmt == "Video Unit": prob += 0.005
        if place == "Above the Fold": prob += 0.007
        if "Mobile" in dev: prob += 0.005 
        prob += (interest * 0.01)

        return {
            "request_id": str(uuid.uuid4())[:8],
            "page_category": cat,
            "ad_format": fmt,
            "placement": place,
            "device_type": dev,
            "user_interest_score": interest,
            "viewability_score": view,
            "true_click_prob": round(min(prob, 0.05), 4),
            "hidden_interval": interval_days,
            "hidden_daily_traffic": daily_traffic
        }