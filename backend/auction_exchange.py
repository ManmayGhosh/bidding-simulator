import random

class AdExchange:
    def __init__(self):
        self.auction_counter = 0

    def run_second_price_auction(self, bid_request, agents):
        self.auction_counter += 1
        bids = [(a.calculate_bid(bid_request), a) for a in agents if a.budget > 0]
        
        if not bids:
            return {"winner_id": "None", "clearing_price": 0, "txn_id": f"TXN-{self.auction_counter:03}", "details": None}
        
        random.shuffle(bids)
        bids.sort(key=lambda x: x[0], reverse=True)
        winner_bid, winner_agent = bids[0]
        
        clearing_price = min(bids[1][0] + 0.01 if len(bids) > 1 else 1000.0, winner_bid)
        is_click = random.random() < bid_request.get('true_click_prob', 0.05)
        
        winner_details = None
        # SYNC: Every agent updates history for every transaction
        for agent in agents:
            is_winner = (agent.id == winner_agent.id)
            details = agent.update_stats(clearing_price, is_click, bid_request, is_winner)
            if is_winner:
                winner_details = details

        return {
            "winner_id": winner_agent.id,
            "clearing_price": round(clearing_price, 2),
            "txn_id": f"TXN-{self.auction_counter:03}",
            "request_id": bid_request.get('request_id'),
            "is_click": is_click,
            "details": winner_details
        }