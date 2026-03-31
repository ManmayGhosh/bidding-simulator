import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as Icons from 'lucide-react';
import { styles } from './styles';
import MerchCard from './components/MerchCard';
import WinningStream from './components/WinningStream';
import AgentLedger from './components/AgentLedger';

const API_BASE = "http://127.0.0.1:8000/api";

const CHART_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', 
  '#8b5cf6', '#f97316', '#14b8a6', '#ef4444', '#a855f7',
  '#3b82f6', '#fbbf24', '#2dd4bf', '#fb7185', '#60a5fa'
];

function App() {
  const [agents, setAgents] = useState([]);
  const [config, setConfig] = useState({ count: 5, budget: 100 });
  const [merchandise, setMerchandise] = useState(null);
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/status`);
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
    setLoading(false);
  };

  const showcaseItem = async () => {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/generate-request`);
    setMerchandise(res.data);
    setLoading(false);
  };

  // Fixed: Update local agents state immediately to reflect in graph
  const startBidding = async () => {
    if (!merchandise) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/run-auction`, merchandise);
      const result = res.data.auction_summary;
      setAuctionHistory(prev => [...prev, { ...result, ad_format: merchandise.ad_format }]);
      
      // Refresh agents to see immediate graph change
      await fetchStatus();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Fixed: Ensure every simulation step is captured by fetching status after the loop
  const runSimulation = async () => {
    setLoading(true);
    for (let i = 0; i < 20; i++) {
      try {
        const itemRes = await axios.get(`${API_BASE}/generate-request`);
        const currentItem = itemRes.data;
        const bidRes = await axios.post(`${API_BASE}/run-auction`, currentItem);
        const result = bidRes.data.auction_summary;
        
        // Accumulate history locally to avoid stale state in loop
        setAuctionHistory(prev => [...prev, { ...result, ad_format: currentItem.ad_format }]);
        setMerchandise(currentItem);
      } catch (err) { console.error(err); }
    }
    // Final sync after the batch simulation
    await fetchStatus();
    setLoading(false);
  };

  const formatChartData = (type) => {
    if (agents.length === 0 || !agents[0].history) return [];
    
    // Find the max history length among all agents to ensure we don't miss steps
    const maxSteps = Math.max(...agents.map(a => a.history.length));
    
    const chartData = [];
    for (let i = 0; i < maxSteps; i++) {
      const point = { cycle: i };
      agents.forEach(a => {
        // Use the value at index i, or the last known value if history is shorter
        const historyItem = a.history[i] || a.history[a.history.length - 1];
        point[a.id] = historyItem ? historyItem[type] : 0;
      });
      chartData.push(point);
    }
    return chartData;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}><Icons.Activity size={20} /></div>
          <div>
            <h1 style={styles.title}>AD-RESONANCE <span style={styles.subTitle}>RL-ENGINE</span></h1>
            <p style={styles.tagline}>Multi-Agent Analytics & Variable Rewards</p>
          </div>
        </div>

        <div style={{...styles.controlGroup, display: 'flex', alignItems: 'center', gap: '12px'}}>
          <button onClick={runSimulation} style={{...styles.secondaryBtn, borderColor: '#10b981', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px'}} disabled={loading || agents.length === 0}>
            <Icons.Zap size={14} /> <span>Run 20x Sim</span>
          </button>

          <div style={{...styles.inputWrapper, minWidth: '100px'}}>
            <Icons.Users size={14} />
            <input type="number" value={config.count} onChange={e => setConfig({...config, count: e.target.value})} style={styles.ghostInput} />
            <span style={styles.inputLabel}>Agents</span>
          </div>

          <div style={{...styles.inputWrapper, minWidth: '110px'}}>
            <Icons.DollarSign size={14} />
            <input type="number" value={config.budget} onChange={e => setConfig({...config, budget: e.target.value})} style={styles.ghostInput} />
            <span style={styles.inputLabel}>Budget</span>
          </div>

          <button onClick={handleInit} style={{...styles.primaryBtn, padding: '10px 20px'}}>Initialize Market</button>
        </div>
      </header>

      <main style={styles.mainGrid}>
        <section style={styles.showcasePanel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}><Icons.Layers size={18} /> Experience Showcase</h2>
            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={showcaseItem} style={styles.secondaryBtn} disabled={loading}><Icons.Eye size={16}/> Reveal</button>
              <button onClick={startBidding} style={styles.ctaBtn} disabled={!merchandise || loading}><Icons.Play size={16}/> Bid</button>
            </div>
          </div>

          <div style={styles.scrollArea}>
            {merchandise ? (
              <div style={styles.specGrid}>
                <MerchCard label='FORMAT' value={merchandise.ad_format} sub={merchandise.ad_slot_size} Icon={Icons.Layout} />
                <MerchCard label='CATEGORY' value={merchandise.page_category} sub={merchandise.geo_country} Icon={Icons.Search} />
                <MerchCard label='INTENT' value={`${Math.round(merchandise.user_interest_score * 100)}% Interest`} sub={merchandise.targeting_type} Icon={Icons.Target} />
                <MerchCard label='DEVICE' value={merchandise.device_type} sub={merchandise.connection_speed} Icon={Icons.Smartphone} />
                <MerchCard label='PLACEMENT' value={merchandise.placement} sub={`SEO: ${merchandise.seo_score}`} Icon={Icons.Navigation} />
                <MerchCard label='VIEWABILITY' value={`${Math.round(merchandise.viewability_score * 100)}%`} sub="AdSense Score" Icon={Icons.Eye} />
              </div>
            ) : (
              <div style={{color:'#334155', textAlign:'center', padding:'150px 0'}}>Awaiting simulation start...</div>
            )}
          </div>
          <WinningStream history={auctionHistory} />
        </section>

        <aside style={styles.sidebarPanel}>
          <div style={styles.sidebarSection}>
            <h3 style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'20px'}}>Budget (Market Participation)</h3>
            <div style={{...styles.chartBox, height: '220px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData('budget')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="cycle" hide />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                  {agents.map((a, idx) => (
                    <Line key={a.id} type="monotone" dataKey={a.id} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={{fontSize:'0.85rem', color:'#10b981', marginBottom:'20px'}}>Learning Growth (Cumulative Profit)</h3>
            <div style={{...styles.chartBox, height: '220px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData('profit')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="cycle" hide />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                  {agents.map((a, idx) => (
                    <Line key={a.id} type="monotone" dataKey={a.id} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <AgentLedger agents={agents} />
        </aside>
      </main>
    </div>
  );
}

export default App;