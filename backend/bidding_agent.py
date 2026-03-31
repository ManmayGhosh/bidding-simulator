import random

class BiddingAgent:
    def __init__(self, agent_id, budget=100000000.0, bias_type=None):
        self.id = agent_id
        self.budget = budget
        self.bias_type = bias_type
        self.clicks = 0
        self.cumulative_profit = 0.0
        # Start history with Point 0 to ensure graphs start correctly
        self.history = [{"budget": budget, "profit": 0.0, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        interest = observation.get('user_interest_score', 0.5)
        view = observation.get('viewability_score', 0.5)
        
        # Policy: Your specific logic scaled for enterprise budgets
        base_bid = (0.25 + (interest * 0.7) + (view * 0.3)) * 10000
        if observation.get('placement') == "Above the Fold": base_bid += 2000
        
        if self.bias_type and self.bias_type in str(observation.values()):
            base_bid *= 1.3

        return round(min(base_bid + random.uniform(-500, 500), self.budget), 2)

    def update_stats(self, cost, clicked, observation):
        self.budget = round(self.budget - cost, 2)
        interval = observation.get('hidden_interval', 90)
        daily_traffic = observation.get('hidden_daily_traffic', 1000)
        total_views = daily_traffic * interval
        predicted_clicks = int(total_views * observation.get('true_click_prob', 0.01))
        
        # Enterprise Revenue Model
        mv_view = 0.0012 
        mv_click = random.uniform(0.80, 3.50) 
        revenue = (total_views * mv_view) + (predicted_clicks * mv_click)
        transaction_profit = round(revenue - cost, 2)
        
        self.cumulative_profit = round(self.cumulative_profit + transaction_profit, 2)
        if clicked: self.clicks += predicted_clicks
        
        self.history.append({"budget": self.budget, "profit": self.cumulative_profit, "clicks": self.clicks})
        
        return {
            "profit": transaction_profit, "revenue": round(revenue, 2),
            "views": total_views, "clicks": predicted_clicks,
            "mv_click": round(mv_click, 2), "mv_view": mv_view, "interval": interval
        }

    def get_status_dict(self):
        return {"id": self.id, "budget": self.budget, "clicks": self.clicks, "profit": self.cumulative_profit, "history": self.history}