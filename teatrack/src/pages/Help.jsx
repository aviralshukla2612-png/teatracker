import React from 'react';
import './Page.css';

export default function Help() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Help & Support</h2>
          <p className="text-muted">Get assistance with using TeaTrack.</p>
        </div>
      </div>
      <div className="card">
        <h3 style={{marginBottom: '16px'}}>Frequently Asked Questions</h3>
        
        <div style={{marginBottom: '20px'}}>
          <h4 style={{marginBottom: '8px'}}>How do I add a new entry?</h4>
          <p className="text-muted" style={{fontSize: '14px', lineHeight: '1.5'}}>
            Navigate to the Dashboard or Daily Entry page and click on the "+ Add Entry" button. Fill in the required details and save.
          </p>
        </div>

        <div style={{marginBottom: '20px'}}>
          <h4 style={{marginBottom: '8px'}}>Can I change the price of tea or coffee?</h4>
          <p className="text-muted" style={{fontSize: '14px', lineHeight: '1.5'}}>
            Yes, you can update the prices from the Dashboard directly or by navigating to the "Rates & Settings" page.
          </p>
        </div>

        <div>
          <h4 style={{marginBottom: '8px'}}>Is my data synced to the cloud?</h4>
          <p className="text-muted" style={{fontSize: '14px', lineHeight: '1.5'}}>
            Currently, all data is stored locally on your device for privacy and speed.
          </p>
        </div>
      </div>
    </div>
  );
}
