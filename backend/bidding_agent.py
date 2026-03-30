import random

class BiddingAgent:
    def __init__(self, agent_id, budget=500.0):
        self.id = agent_id
        self.budget = budget
        self.clicks = 0
        self.cumulative_profit = 0.0
        self.history = [{"budget": budget, "profit": 0.0, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        interest = observation.get('user_interest_score', 0.5)
        view = observation.get('viewability_score', 0.5)
        
        # Policy: Bid higher when signals are strong
        base_bid = 0.25 + (interest * 0.7) + (view * 0.3)
        if observation.get('placement') == "Above the Fold": base_bid += 0.2
        
        bid_value = base_bid + random.uniform(-0.05, 0.05)
        return round(min(bid_value, self.budget), 2)

    def update_stats(self, cost, clicked, observation):
        self.budget = round(self.budget - cost, 2)
        
        # Reward Logic
        reward_val = 5.0 if clicked else 0.0 
        transaction_profit = round(reward_val - cost, 2)
        self.cumulative_profit = round(self.cumulative_profit + transaction_profit, 2)
        
        if clicked:
            self.clicks += 1
            
        self.history.append({
            "budget": self.budget,
            "profit": self.cumulative_profit,
            "clicks": self.clicks
        })

    def get_status_dict(self):
        return {
            "id": self.id,
            "budget": self.budget,
            "clicks": self.clicks,
            "profit": self.cumulative_profit,
            "history": self.history
        }