import React from 'react';
import './SummaryCard.css';

export default function SummaryCard({ title, mainValue, subValue, icon, variant }) {
  return (
    <div className={`summary-card variant-${variant || 'default'}`}>
      <div className="summary-icon">{icon}</div>
      <div className="summary-content">
        <h3 className="summary-title">{title}</h3>
        <div className="summary-main">{mainValue}</div>
        <div className="summary-sub">{subValue}</div>
      </div>
    </div>
  );
}
