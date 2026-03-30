import React from 'react';
import { ShieldCheck, XCircle, DollarSign, Tag } from 'lucide-react';

const WinningStream = ({ history }) => {
  return (
    <div style={streamContainer}>
      <h3 style={streamTitle}>Live Acquisition Stream</h3>
      <div style={scrollList}>
        {history.length === 0 ? (
          <p style={emptyText}>Waiting for market activity...</p>
        ) : (
          history.map((item, index) => (
            <div key={index} style={streamRow}>
              <div style={rowLeft}>
                {item.is_click ? <ShieldCheck size={16} color="#10b981"/> : <XCircle size={16} color="#ef4444"/>}
                <span style={agentName}>{item.winner_id}</span>
              </div>
              <div style={rowRight}>
                <span style={tagStyle}><Tag size={12}/> {item.ad_format}</span>
                <span style={priceStyle}><DollarSign size={12}/>{item.clearing_price}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles for the Stream
const streamContainer = { background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', padding: '20px', marginTop: '30px' };
const streamTitle = { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const scrollList = { maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '8px' };
const streamRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '10px 15px', borderRadius: '8px', border: '1px solid #1e293b' };
const rowLeft = { display: 'flex', alignItems: 'center', gap: '10px' };
const rowRight = { display: 'flex', gap: '15px', alignItems: 'center' };
const agentName = { fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' };
const priceStyle = { color: '#6366f1', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const tagStyle = { color: '#475569', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' };
const emptyText = { color: '#334155', fontStyle: 'italic', textAlign: 'center' };

export default WinningStream;