import React from 'react';
import './Page.css';

export default function About() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>About TeaTrack</h2>
          <p className="text-muted">Learn more about the application.</p>
        </div>
      </div>
      <div className="card" style={{lineHeight: '1.6'}}>
        <h3>Version 1.0.0</h3>
        <p style={{marginTop: '12px'}}>
          TeaTrack is a simple, elegant expense tracker designed specifically for offices and teams to monitor their daily tea and coffee consumption.
        </p>
        <p style={{marginTop: '12px'}}>
          Built with React and modern web technologies to provide a fast and seamless user experience.
        </p>
        <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E2E8F0'}}>
          <p className="text-muted" style={{fontSize: '14px'}}>© 2026 TeaTrack. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
