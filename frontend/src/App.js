import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import * as Icons from 'lucide-react';
import { styles } from './styles';
import MerchCard from './components/MerchCard';
import WinningStream from './components/WinningStream';
import AgentLedger from './components/AgentLedger'; // Import new component

const API_BASE = "http://127.0.0.1:8000/api";

function App() {
  const [agents, setAgents] = useState([]);
  const [config, setConfig] = useState({ count: 5, budget: 500 });
  const [merchandise, setMerchandise] = useState(null);
  const [winner, setWinner] = useState(null);
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`);
      // FIXED: Spread operator ensures React triggers a re-render for the Chart
      setAgents([...res.data.agents]);
    } catch (e) { console.log("Init required"); }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleInit = async () => {
    setLoading(true);
    await axios.post(`${API_BASE}/init-sim`, config);
    setAuctionHistory([]);
    await fetchStatus();
    setMerchandise(null);
    setWinner(null);
    setLoading(false);
  };

  const showcaseItem = async () => {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/generate-request`);
    setMerchandise(res.data);
    setWinner(null);
    setLoading(false);
  };

  const startBidding = async () => {
    if (!merchandise) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/run-auction`, merchandise);
      const result = res.data.auction_summary;
      setWinner(result);
      setAuctionHistory(prev => [...prev, { ...result, ad_format: merchandise.ad_format }]);
      await fetchStatus();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}><Icons.Activity size={20} /></div>
          <div>
            <h1 style={styles.title}>AD-RESONANCE <span style={styles.subTitle}>RL-ENGINE</span></h1>
            <p style={styles.tagline}>Bidding Optimization & Multi-Agent Analytics</p>
          </div>
        </div>
        <div style={styles.controlGroup}>
          <div style={styles.inputWrapper}>
            <Icons.Users size={14} /><input type="number" value={config.count} onChange={e => setConfig({...config, count: e.target.value})} style={styles.ghostInput} /><span style={styles.inputLabel}>Agents</span>
          </div>
          <div style={styles.inputWrapper}>
            <Icons.DollarSign size={14} /><input type="number" value={config.budget} onChange={e => setConfig({...config, budget: e.target.value})} style={styles.ghostInput} /><span style={styles.inputLabel}>Budget</span>
          </div>
          <button onClick={handleInit} style={styles.primaryBtn}>Initialize Market</button>
        </div>
      </header>

      <main style={styles.mainGrid}>
        {/* LEFT 60% */}
        <section style={styles.showcasePanel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}><Icons.Layers size={18} /> Merchandise Showcase</h2>
            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={showcaseItem} style={styles.secondaryBtn} disabled={loading}><Icons.Eye size={16}/> 1. Reveal</button>
              <button onClick={startBidding} style={styles.ctaBtn} disabled={!merchandise || winner || loading}><Icons.Play size={16}/> 2. Bid</button>
            </div>
          </div>

          <div style={styles.scrollArea}>
            {merchandise ? (
              <div style={styles.specGrid}>
                <MerchCard label='THE "WHAT" (FORMAT)' value={merchandise.ad_format} sub={merchandise.ad_slot_size} Icon={Icons.Layout} />
                <MerchCard label='THE "WHO" (DEMOGRAPHICS)' value={merchandise.geo_country} sub={merchandise.location_type} Icon={Icons.Globe} />
                <MerchCard label='THE "WHY" (INTENT)' value={merchandise.targeting_type} sub={`Interest: ${Math.round(merchandise.user_interest_score * 100)}%`} Icon={Icons.Target} />
                <MerchCard label='TECHNICAL PROFILING' value={merchandise.device_type} sub={merchandise.connection_speed} Icon={Icons.Cpu} />
                <MerchCard label='VISIBILITY ZONE' value={merchandise.placement} sub={`SEO: ${merchandise.seo_score}`} Icon={Icons.Navigation} />
                <MerchCard label='CONTEXTUAL ANALYSIS' value={merchandise.page_category} sub="AdSense Relevance Engine" Icon={Icons.Search} />
              </div>
            ) : (
              <div style={{color:'#334155', textAlign:'center', padding:'150px 0'}}>Awaiting merchandise Reveal...</div>
            )}
          </div>
          <WinningStream history={auctionHistory} />
        </section>

        {/* RIGHT 40% */}
        <aside style={styles.sidebarPanel}>
          <div style={styles.sidebarSection}>
            <h3 style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'20px'}}><Icons.BarChart3 size={16} /> RL Learning Progress</h3>
            <div style={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agents.length > 0 ? agents[0].history.map((_, i) => ({ 
                  cycle: i, 
                  ...agents.reduce((acc, a) => ({ ...acc, [a.id]: a.history[i]?.budget }), {}) 
                })) : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="cycle" hide />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                  <Legend iconType="circle" />
                  {agents.slice(0, 5).map((a, idx) => (
                    <Line 
                      key={a.id} 
                      type="monotone" 
                      dataKey={a.id} 
                      stroke={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][idx]} 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false} // FIXED: Prevents chart black-outs on rapid updates
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* NEW: Agent Budget Ledger at bottom right */}
          <AgentLedger agents={agents} />
        </aside>
      </main>
    </div>
  );
}

export default App;