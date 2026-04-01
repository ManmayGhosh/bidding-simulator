import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as Icons from 'lucide-react';
import { styles } from './styles';
import MerchCard from './components/MerchCard';
import WinningStream from './components/WinningStream';
import AgentLedger from './components/AgentLedger';

const API_BASE = "http://127.0.0.1:8000/api";
const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444', '#a855f7'];

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
    } catch (e) { console.log("Fetch failed"); }
  };

  useEffect(() => { fetchStatus(); }, []);

  const runSimulation = async () => {
    setLoading(true);
    for (let i = 0; i < 20; i++) {
      try {
        const itemRes = await axios.get(`${API_BASE}/generate-request`);
        const bidRes = await axios.post(`${API_BASE}/run-auction`, itemRes.data);
        const summary = bidRes.data.auction_summary;
        
        setAuctionHistory(prev => [...prev, { ...summary, ad_format: itemRes.data.ad_format }]);
        setMerchandise(itemRes.data);
        
        // SYNC: Wait for chart update before starting next auction
        await fetchStatus(); 
      } catch (err) { console.error(err); }
    }
    setLoading(false);
  };

  const formatChartData = (type) => {
    if (!agents.length || !agents[0].history) return [];
    // Strict 1:1 mapping because history lengths are now identical
    const steps = agents[0].history.length;
    return Array.from({ length: steps }, (_, i) => {
      const entry = { cycle: i };
      agents.forEach(a => {
        entry[a.id] = a.history[i] ? a.history[i][type] : 0;
      });
      return entry;
    });
  };

  const handleInit = async () => {
    setLoading(true);
    await axios.post(`${API_BASE}/init-sim`, config);
    setAuctionHistory([]);
    await fetchStatus();
    setMerchandise(null);
    setLoading(false);
  };

  const startBidding = async () => {
    if (!merchandise) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/run-auction`, merchandise);
      setAuctionHistory(prev => [...prev, { ...res.data.auction_summary, ad_format: merchandise.ad_format }]);
      await fetchStatus();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showcaseItem = async () => {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/generate-request`);
    setMerchandise(res.data);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}><Icons.Activity size={20} /></div>
          <div>
            <h1 style={styles.title}>AD-RESONANCE <span style={styles.subTitle}>RL-ENGINE</span></h1>
            <p style={styles.tagline}>Multi-Agent Analytics</p>
          </div>
        </div>
        <div style={styles.controlGroup}>
          <button onClick={runSimulation} style={{...styles.secondaryBtn, borderColor: '#10b981', color: '#10b981'}} disabled={loading || !agents.length}>
            <Icons.Zap size={14}/> Run 20x Sim
          </button>
          <div style={styles.inputWrapper}><Icons.Users size={14} /><input type="number" value={config.count} onChange={e => setConfig({...config, count: e.target.value})} style={styles.ghostInput} /><span style={styles.inputLabel}>Agents</span></div>
          <div style={styles.inputWrapper}><Icons.DollarSign size={14} /><input type="number" value={config.budget} onChange={e => setConfig({...config, budget: e.target.value})} style={styles.ghostInput} /><span style={styles.inputLabel}>Budget</span></div>
          <button onClick={handleInit} style={styles.primaryBtn}>Initialize</button>
        </div>
      </header>
      <main style={styles.mainGrid}>
        <section style={styles.showcasePanel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}><Icons.Layers size={18} /> Showcase</h2>
            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={showcaseItem} style={styles.secondaryBtn}>Reveal</button>
              <button onClick={startBidding} style={styles.ctaBtn}>Bid</button>
            </div>
          </div>
          <div style={styles.scrollArea}>
            {merchandise ? (
              <div style={styles.specGrid}>
                <MerchCard label='FORMAT' value={merchandise.ad_format} sub={merchandise.ad_slot_size} Icon={Icons.Layout} />
                <MerchCard label='CATEGORY' value={merchandise.page_category} sub={merchandise.geo_country} Icon={Icons.Search} />
                <MerchCard label='INTENT' value={`${Math.round(merchandise.user_interest_score * 100)}%`} sub="Interest" Icon={Icons.Target} />
                <MerchCard label='DEVICE' value={merchandise.device_type} sub="Connection" Icon={Icons.Smartphone} />
                <MerchCard label='PLACEMENT' value={merchandise.placement} sub="SEO Spot" Icon={Icons.Navigation} />
                <MerchCard label='VIEW' value={`${Math.round(merchandise.viewability_score * 100)}%`} sub="Score" Icon={Icons.Eye} />
              </div>
            ) : <div style={{textAlign:'center', padding:'150px 0'}}>Waiting for simulation start...</div>}
          </div>
          <WinningStream history={auctionHistory} />
        </section>
        <aside style={styles.sidebarPanel}>
          <div style={styles.sidebarSection}>
            <h3 style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:'20px'}}>Budget</h3>
            <div style={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData('budget')}>
                  <CartesianGrid stroke="#334155" vertical={false} strokeDasharray="3 3"/>
                  <XAxis dataKey="cycle" hide/>
                  <YAxis stroke="#475569" fontSize={10} axisLine={false}/>
                  <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #334155'}}/>
                  {agents.map((a, idx) => (
                    <Line key={a.id} type="monotone" dataKey={a.id} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={{fontSize:'0.85rem', color:'#10b981', marginBottom:'20px'}}>Learning Growth</h3>
            <div style={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData('profit')}>
                  <CartesianGrid stroke="#334155" vertical={false} strokeDasharray="3 3"/>
                  <XAxis dataKey="cycle" hide/>
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #334155'}}/>
                  {agents.map((a, idx) => (
                    <Line key={a.id} type="monotone" dataKey={a.id} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={false} isAnimationActive={false}/>
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