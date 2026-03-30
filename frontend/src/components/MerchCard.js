import React from 'react';
import { styles } from '../styles';

const MerchCard = ({ label, value, sub, Icon }) => (
  <div style={styles.specCard}>
    <label style={styles.specLabel}>{label}</label>
    <div style={styles.specValue}>
      <Icon size={14} /> {value}
    </div>
    <div style={styles.specSub}>{sub}</div>
  </div>
);

export default MerchCard;