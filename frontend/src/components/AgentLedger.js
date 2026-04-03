import React from 'react';
import { Wallet, User, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

const AgentLedger = ({ agents }) => {
  return (
    <div style={ledgerContainer}>
      <h3 style={ledgerTitle}>Live Agent Ledger (ROI)</h3>
      <div style={scrollList}>
        {agents.length === 0 ? <p style={emptyText}>Waiting for market...</p> : 
          agents.map((agent) => {
            const isProfitable = agent.profit >= 0;
            return (
              <div key={agent.id} style={ledgerRow}>
                <div style={rowLeft}>
                  <div style={avatarBox}><User size={14} color="#6366f1"/></div>
                  <div>
                    <div style={agentName}>{agent.id}</div>
                    {/* REPLACED CLICKS WITH UNIVERSAL SPECIALTY LABEL */}
                    <div style={universalLabel}>
                      <Globe size={10} style={{marginRight: '4px'}}/>
                      {agent.universal_specialty}
                    </div>
                  </div>
                </div>
                
                <div style={rowRight}>
                  <div style={budgetBox}>
                    <Wallet size={12} style={{marginRight: '4px'}}/>
                    <span>${agent.budget.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div style={profitBadge(isProfitable)}>
                    {isProfitable ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                    ${Math.abs(agent.profit).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

const universalLabel = { 
  fontSize: '0.65rem', 
  color: '#6366f1', 
  display: 'flex', 
  alignItems: 'center',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  marginTop: '2px',
  letterSpacing: '0.03em'
};

const ledgerContainer = { background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', padding: '20px', marginTop: '20px' };
const ledgerTitle = { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase' };
const scrollList = { maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const ledgerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '12px 15px', borderRadius: '12px', border: '1px solid #1e293b' };
const rowLeft = { display: 'flex', alignItems: 'center', gap: '12px' };
const rowRight = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' };
const avatarBox = { background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '8px' };
const agentName = { fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' };
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