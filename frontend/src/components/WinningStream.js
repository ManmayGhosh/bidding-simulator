import React, { useState } from 'react';
import { DollarSign, Tag, Hash, Fingerprint } from 'lucide-react';

const WinningStream = ({ history }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div style={streamContainer}>
      <h3 style={streamTitle}>Acquisition Stream</h3>
      <div style={scrollList}>
        {history.length === 0 ? <p style={emptyText}>Waiting for market activity...</p> : 
          history.map((item, index) => {
            const isProfit = item.details ? item.details.profit >= 0 : false;
            return (
              <div key={index} style={streamRow} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <div style={rowLeft}>
                  <div style={serialBadge}><Hash size={10}/>{item.txn_id}</div>
                  <span style={agentName}>{item.winner_id}</span>
                </div>
                
                {hoveredIndex === index && item.details && (
                  <div style={popupContainer}>
                    <div style={popupHeader}>Enterprise Contract Data</div>
                    <div style={debugRow}><Fingerprint size={10}/> ID: {item.request_id}</div>
                    <div style={popupGrid}>
                      <span>Interval:</span> <strong>{item.details.interval} Days</strong>
                      <span>Exp. Revenue:</span> <strong>${item.details.revenue.toLocaleString()}</strong>
                      <span>Exp. Clicks:</span> <strong>{item.details.clicks.toLocaleString()}</strong>
                      <span>Exp. Views:</span> <strong>{item.details.views.toLocaleString()}</strong>
                      <span>Exp. Profit:</span> 
                      <strong style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                        {isProfit ? '' : '-'}${Math.abs(item.details.profit).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                )}
                
                <div style={rowRight}>
                  <span style={tagStyle}><Tag size={12}/> {item.ad_format}</span>
                  <span style={priceStyle}><DollarSign size={12}/>{item.clearing_price.toLocaleString()}</span>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

// Styles for the Stream
const serialBadge = { background: '#1e293b', color: '#6366f1', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', border: '1px solid #334155', fontFamily: 'monospace' };
const debugRow = { fontSize: '0.6rem', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' };
const popupContainer = { position: 'absolute', background: '#1e293b', border: '1px solid #334155', padding: '15px', borderRadius: '12px', zIndex: 100, width: '220px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', left: '120px', top: '-60px' };
const popupHeader = { fontSize: '0.7rem', color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' };
const popupGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '0.75rem', gap: '8px', color: '#f1f5f9' };
const streamContainer = { background: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', padding: '20px', marginTop: '30px' };
const streamTitle = { fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase' };
const scrollList = { maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '10px' };
const streamRow = { display: 'flex', position: 'relative', justifyContent: 'space-between', alignItems: 'center', background: '#020617', padding: '12px 15px', borderRadius: '12px', border: '1px solid #1e293b' };
const rowLeft = { display: 'flex', alignItems: 'center', gap: '10px' };
const rowRight = { display: 'flex', gap: '15px', alignItems: 'center' };
const agentName = { fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' };
const priceStyle = { color: '#6366f1', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' };
const tagStyle = { color: '#475569', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' };
const emptyText = { color: '#334155', fontStyle: 'italic', textAlign: 'center' };

export default WinningStream;