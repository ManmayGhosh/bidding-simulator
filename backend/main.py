from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from publisher_env import WebPublisherSimulator
from bidding_agent import BiddingAgent
from auction_exchange import AdExchange
import random

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

simulator = WebPublisherSimulator()
exchange = AdExchange()
agents = []

@app.post("/api/init-sim")
async def init_sim(data: dict = Body(...)):
    global agents
    exchange.auction_counter = 0 
    count = int(data.get("count", 5))
    budget = float(data.get("budget", 100)) * 1000000 
    
    # Existing General Bias Pool
    bias_pool = ["Finance", "Tech", "Video Unit", "Above the Fold", "Mobile (iOS)", "High Interest"]
    
    # NEW: Universal Variable Pool (Categories an agent can specialize in)
    universal_pool = [
        {"label": "Geography Specialist", "key": "geo_city"},
        {"label": "Demographic Specialist", "key": "demographic_age"},
        {"label": "Format Specialist", "key": "ad_format"},
        {"label": "Category Specialist", "key": "page_category"},
        {"label": "Placement Specialist", "key": "placement"},
        {"label": "Device Specialist", "key": "device_type"}
    ]

    agents = []
    for i in range(count):
        # Assign a random universal specialty
        specialty = random.choice(universal_pool)
        
        agents.append(BiddingAgent(
            f"Agent_{i+1}", 
            budget=budget, 
            bias_type=random.choice(bias_pool),
            extra_universal_pool=specialty # Pass the label and the data key
        ))
    
    return {"status": "success"}

@app.get("/api/status")
async def get_status():
    return {"agents": [a.get_status_dict() for a in agents]} #

@app.post("/api/run-auction")
async def run_auction(bid_request: dict = Body(...)):
    return {"auction_summary": exchange.run_second_price_auction(bid_request, agents)} #

@app.get("/api/generate-request")
async def get_merchandise():
    return simulator.generate_bid_request() 