import random

class BiddingAgent:
    def __init__(self, agent_id, budget=100000000.0, bias_type=None, extra_bias_feature=None, is_universal_specialist=False):
        self.id = agent_id
        self.budget = budget
        self.bias_type = bias_type
        self.extra_bias_feature = extra_bias_feature
        self.is_universal_specialist = is_universal_specialist
        self.clicks = 0
        self.cumulative_profit = 0.0
        self.history = [{"budget": budget, "profit": 0.0, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        
        # Latent signals (hidden from UI but known to agent)
        interest = observation.get('user_interest_score', 0.5)
        view = observation.get('viewability_score', 0.5)
        
        base_bid = (0.25 + (interest * 0.7) + (view * 0.3)) * 10000
        
        # New demographic-based bidding weight
        if observation.get('demographic_age') in ["25-34", "35-44"]:
            base_bid += 1500
        
        # Multi-layer bias application
        if self.bias_type and self.bias_type in str(observation.values()):
            base_bid *= 1.3
        
        if self.is_universal_specialist and observation.get('page_category'):
            base_bid *= 1.4 

        return round(min(base_bid + random.uniform(-500, 500), self.budget), 2)

    def update_stats(self, cost, clicked, observation, is_winner):
        if is_winner:
            self.budget = round(self.budget - cost, 2)
            interval, daily = observation.get('hidden_interval', 90), observation.get('hidden_daily_traffic', 1000)
            total_views = daily * interval
            predicted_clicks = int(total_views * observation.get('true_click_prob', 0.01))
            revenue = (total_views * 0.0012) + (predicted_clicks * random.uniform(0.80, 3.50))
            profit = round(revenue - cost, 2)
            self.cumulative_profit = round(self.cumulative_profit + profit, 2)
            if clicked: self.clicks += predicted_clicks
            self.history.append({"budget": self.budget, "profit": self.cumulative_profit, "clicks": self.clicks})
            return {"profit": profit, "revenue": round(revenue, 2), "views": total_views, "clicks": predicted_clicks, "interval": interval}
        else:
            self.history.append({"budget": self.budget, "profit": self.cumulative_profit, "clicks": self.clicks})
            return None

    def get_status_dict(self):
        specialty = self.extra_bias_feature if self.extra_bias_feature else "Generalist"
        if self.is_universal_specialist: specialty = f"Universal Specialist | {specialty}"
        return {"id": self.id, "budget": self.budget, "clicks": self.clicks, "profit": self.cumulative_profit, "history": self.history, "extra_bias": specialty}