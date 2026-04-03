import random

class BiddingAgent:
    def __init__(self, agent_id, budget=100000000.0, bias_type=None, extra_universal_pool=None):
        self.id = agent_id
        self.budget = budget
        self.bias_type = bias_type
        self.extra_universal_pool = extra_universal_pool # NEW
        self.clicks = 0
        self.cumulative_profit = 0.0
        self.history = [{"budget": budget, "profit": 0.0, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        
        interest = observation.get('user_interest_score', 0.5)
        view = observation.get('viewability_score', 0.5)
        base_bid = (0.25 + (interest * 0.7) + (view * 0.3)) * 10000
        
        # 1. Apply General Bias
        if self.bias_type and self.bias_type in str(observation.values()):
            base_bid *= 1.3
        
        # 2. NEW: Universal Pool Bias (Biased toward any value in the category)
        if self.extra_universal_pool:
            target_key = self.extra_universal_pool["key"]
            if observation.get(target_key):
                # Agent bids higher because it is a specialist for this category
                base_bid *= 1.4 

        return round(min(base_bid + random.uniform(-500, 500), self.budget), 2)

    def update_stats(self, cost, clicked, observation, is_winner):
        if is_winner:
            self.budget = round(self.budget - cost, 2)
            interval = observation.get('hidden_interval', 90)
            daily_traffic = observation.get('hidden_daily_traffic', 1000)
            total_views = daily_traffic * interval
            predicted_clicks = int(total_views * observation.get('true_click_prob', 0.01))
            
            mv_view, mv_click = 0.0012, random.uniform(0.80, 3.50) 
            revenue = (total_views * mv_view) + (predicted_clicks * mv_click)
            transaction_profit = round(revenue - cost, 2)
            
            self.cumulative_profit = round(self.cumulative_profit + transaction_profit, 2)
            if clicked: self.clicks += predicted_clicks
            self.history.append({"budget": self.budget, "profit": self.cumulative_profit, "clicks": self.clicks})
            return {"profit": transaction_profit, "revenue": round(revenue, 2), "views": total_views, "clicks": int(predicted_clicks), "interval": interval}
        else:
            self.history.append({"budget": self.budget, "profit": self.cumulative_profit, "clicks": self.clicks})
            return None

    def get_status_dict(self):
        return {
            "id": self.id, "budget": self.budget, "clicks": self.clicks, 
            "profit": self.cumulative_profit, "history": self.history,
            "universal_specialty": self.extra_universal_pool["label"] if self.extra_universal_pool else "Generalist"
        }