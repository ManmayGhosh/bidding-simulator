import React from 'react';
import { Wallet, TrendingDown, User } from 'lucide-react';

const AgentLedger = ({ agents }) => {
  return (
    <div style={ledgerContainer}>
      <h3 style={ledgerTitle}>Live Agent Status (Budget)</h3>
      <div style={scrollList}>
        {agents.length === 0 ? (
          <p style={emptyText}>No agents initialized...</p>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} style={ledgerRow}>
              <div style={rowLeft}>
                <div style={avatarBox}><User size={14} color="#6366f1"/></div>
                <span style={agentName}>{agent.id}</span>
              </div>
              <div style={rowRight}>
                <div style={budgetBox}>
                  <Wallet size={12} style={{marginRight: '6px'}}/>
                  <span>${agent.budget.toFixed(2)}</span>
                </div>
                {agent.budget < 50 && <TrendingDown size={14} color="#ef4444" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const ledgerContainer = { background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', padding: '20px', marginTop: '20px' };
const ledgerTitle = { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const scrollList = { maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const ledgerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '12px 15px', borderRadius: '12px', border: '1px solid #1e293b' };
const rowLeft = { display: 'flex', alignItems: 'center', gap: '12px' };
const rowRight = { display: 'flex', alignItems: 'center', gap: '15px' };
const avatarBox = { background: 'rgba(99, 102, 241, 0.1)', padding: '6px', borderRadius: '8px' };
const agentName = { fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' };
const budgetBox = { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const emptyText = { color: '#334155', textAlign: 'center', padding: '20px' };

export default AgentLedger;