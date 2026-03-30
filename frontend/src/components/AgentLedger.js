import React from 'react';
import { Wallet, TrendingUp, TrendingDown, User, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AgentLedger = ({ agents }) => {
  return (
    <div style={ledgerContainer}>
      <h3 style={ledgerTitle}>Live Agent Ledger (ROI)</h3>
      <div style={scrollList}>
        {agents.length === 0 ? (
          <p style={emptyText}>No agents initialized...</p>
        ) : (
          agents.map((agent) => {
            const isProfitable = agent.profit >= 0;
            return (
              <div key={agent.id} style={ledgerRow}>
                <div style={rowLeft}>
                  <div style={avatarBox}><User size={14} color="#6366f1"/></div>
                  <div>
                    <div style={agentName}>{agent.id}</div>
                    <div style={clickCount}>{agent.clicks} Clicks Secured</div>
                  </div>
                </div>
                
                <div style={rowRight}>
                  {/* Budget Display */}
                  <div style={budgetBox}>
                    <Wallet size={12} style={{marginRight: '4px'}}/>
                    <span>${agent.budget.toFixed(2)}</span>
                  </div>

                  {/* Profit Badge - PROOF OF RL GROWTH */}
                  <div style={profitBadge(isProfitable)}>
                    {isProfitable ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                    ${Math.abs(agent.profit).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const ledgerContainer = { background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', padding: '20px', marginTop: '20px' };
const ledgerTitle = { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const scrollList = { maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const ledgerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '12px 15px', borderRadius: '12px', border: '1px solid #1e293b' };
const rowLeft = { display: 'flex', alignItems: 'center', gap: '12px' };
const rowRight = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' };
const avatarBox = { background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '8px' };
const agentName = { fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' };
const clickCount = { fontSize: '0.7rem', color: '#475569' };
const budgetBox = { color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center' };
const profitBadge = (isPos) => ({
  background: isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
  color: isPos ? '#10b981' : '#ef4444',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: `1px solid ${isPos ? '#10b981' : '#ef4444'}`
});
const emptyText = { color: '#334155', textAlign: 'center', padding: '20px' };

export default AgentLedger;