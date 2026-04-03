import random
import uuid

class WebPublisherSimulator:
    def __init__(self):
        self.categories = ["Finance", "Tech", "Gaming", "Health", "Automotive", "Travel"]
        self.formats = ["Video Unit", "Interstitial", "Native Feed", "Sticky Anchor", "Standard Display"]
        self.placements = ["Above the Fold", "In-Feed", "Sticky Footer", "Sidebar", "Bottom of Page"]
        self.devices = ["Mobile (iOS)", "Mobile (Android)", "Desktop"]
        
        # New Feature Pools for Demographics and Geography
        self.age_groups = ["18-24", "25-34", "35-44", "45-54", "55+"]
        self.genders = ["Male", "Female", "Non-Binary"]
        self.regions = ["North America", "Europe", "APAC", "LATAM", "MENA"]
        self.cities = ["New York", "London", "Tokyo", "Berlin", "Mumbai", "Paris"]

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

        # Hidden states used for reward calculation but unknown to UI
        interest = round(random.uniform(0.1, 0.95), 4)
        view = round(random.uniform(0.4, 0.90), 2)

        # Enterprise interval data
        interval_days = random.choice([90, 180, 360]) 
        daily_traffic = random.randint(500, 2500) 

        # Click probability influenced by new demographics
        prob = 0.005 
        if cat in ["Finance", "Tech"]: prob += 0.008
        if age == "25-34": prob += 0.005
        if region == "North America": prob += 0.003
        prob += (interest * 0.01)

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
            "true_click_prob": round(min(prob, 0.05), 4),
            "hidden_interval": interval_days,
            "hidden_daily_traffic": daily_traffic
        }