import random

class BiddingAgent:
    def __init__(self, agent_id, budget=500.0):
        self.id = agent_id
        self.budget = budget
        self.clicks = 0
        self.cumulative_profit = 0.0
        # Start history with baseline values
        self.history = [{"budget": budget, "profit": 0.0, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        interest = observation.get('user_interest_score', 0.5)
        # Policy determines action based on state
        bid_value = 0.25 + (interest * 0.7) + random.uniform(-0.1, 0.1)
        return round(min(bid_value, self.budget), 2)

    def update_stats(self, cost, clicked, observation):
        # 1. Deduct cost from budget
        self.budget = round(self.budget - cost, 2)
        
        # 2. Reward calculation for RL visualization
        # Reward is $5.00 per click minus the cost of the winning bid
        reward_val = 5.0 if clicked else 0.0
        net_change = reward_val - cost
        self.cumulative_profit = round(self.cumulative_profit + net_change, 2)
        
        if clicked:
            self.clicks += 1
            
        # 3. Update history for the dual charts
        self.history.append({
            "budget": self.budget,
            "profit": self.cumulative_profit,
            "clicks": self.clicks
        })

    def get_status_dict(self):
        """Returns full state for the AgentLedger and Charts"""
        return {
            "id": self.id,
            "budget": self.budget,
            "clicks": self.clicks,
            "profit": self.cumulative_profit,
            "history": self.history
        }