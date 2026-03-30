import random

class AdExchange:
    def run_second_price_auction(self, bid_request, agents):
        bids = []
        for agent in agents:
            if agent.budget > 0:
                price = agent.calculate_bid(bid_request)
                if price > 0:
                    bids.append((price, agent))
        
        if not bids:
            return {"winner_id": "None", "clearing_price": 0.00, "is_click": False}

        random.shuffle(bids)
        bids.sort(key=lambda x: x[0], reverse=True)
        
        winner_bid, winner_agent = bids[0]
        clearing_price = bids[1][0] + 0.01 if len(bids) > 1 else 0.10
        clearing_price = min(clearing_price, winner_bid)
        is_click = random.random() < bid_request.get('true_click_prob', 0.05)

        return {
            "winner_id": winner_agent.id,
            "clearing_price": round(clearing_price, 2),
            "is_click": is_click
        }