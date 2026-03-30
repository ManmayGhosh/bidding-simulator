import random

class BiddingAgent:
    def __init__(self, agent_id, budget=500.0):
        self.id = agent_id
        self.budget = budget
        self.clicks = 0
        # CRITICAL: React Chart needs a starting point to render the first dot
        self.history = [{"budget": budget, "clicks": 0}]

    def calculate_bid(self, observation):
        if self.budget <= 0: return 0.0
        # Heuristic bid based on dimensions
        interest = observation.get('user_interest_score', 0.5)
        view = observation.get('viewability_score', 0.5)
        base = 0.25 + (interest * 0.7) + (view * 0.3)
        # Random noise ensures unique lines on the chart
        bid_value = base + random.uniform(-0.1, 0.1)
        return round(min(bid_value, self.budget), 2)

    def update_stats(self, cost, clicked, observation):
        self.budget = round(self.budget - cost, 2)
        if clicked:
            self.clicks += 1
        # Push new state to history for React Chart
        self.history.append({"budget": self.budget, "clicks": self.clicks})

    def get_status_dict(self):
        return {
            "id": self.id,
            "budget": self.budget,
            "clicks": self.clicks,
            "history": self.history
        }