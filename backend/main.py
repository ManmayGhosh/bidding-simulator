from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from publisher_env import WebPublisherSimulator
from bidding_agent import BiddingAgent
from auction_exchange import AdExchange

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = WebPublisherSimulator()
exchange = AdExchange()
agents = []

@app.post("/api/init-sim")
async def init_sim(data: dict = Body(...)):
    global agents
    count = int(data.get("count", 5))
    budget = float(data.get("budget", 500.0))
    agents = [BiddingAgent(f"Agent_{i+1}", budget=budget) for i in range(count)]
    return {"status": "success"}

@app.get("/api/status")
async def get_status():
    return {"agents": [a.get_status_dict() for a in agents]}

@app.post("/api/run-auction")
async def run_auction(bid_request: dict = Body(...)):
    summary = exchange.run_second_price_auction(bid_request, agents)
    for agent in agents:
        is_winner = (agent.id == summary['winner_id'])
        cost = summary['clearing_price'] if is_winner else 0
        agent.update_stats(cost, summary['is_click'] if is_winner else False, bid_request)
    return {"auction_summary": summary}

@app.get("/api/generate-request")
async def get_merchandise():
    return simulator.generate_bid_request()