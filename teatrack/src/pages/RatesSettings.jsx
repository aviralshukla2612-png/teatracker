import React, { useState } from 'react';
import './Page.css';
import './RatesSettings.css';

function SuccessModal({ oldTeaRate, oldCoffeeRate, newTeaRate, newCoffeeRate, onClose }) {
  return (
    <div className="rs-modal-overlay" onClick={onClose}>
      <div className="rs-modal" onClick={e => e.stopPropagation()}>
        {/* Animated checkmark */}
        <div className="rs-success-ring">
          <div className="rs-checkmark">✓</div>
        </div>

        <h2 className="rs-modal-title">Rates Updated!</h2>
        <p className="rs-modal-sub">The new rates are now active and will reflect across all calculations.</p>

        <div className="rs-rate-comparison">
          {/* Tea */}
          <div className="rs-compare-card">
            <span className="rs-compare-icon">🍵</span>
            <p className="rs-compare-label">Tea Rate</p>
            <div className="rs-compare-values">
              <span className="rs-old-val">₹{oldTeaRate}</span>
              <span className="rs-arrow">→</span>
              <span className="rs-new-val">₹{newTeaRate}</span>
            </div>
          </div>
          {/* Coffee */}
          <div className="rs-compare-card">
            <span className="rs-compare-icon">☕</span>
            <p className="rs-compare-label">Coffee Rate</p>
            <div className="rs-compare-values">
              <span className="rs-old-val">₹{oldCoffeeRate}</span>
              <span className="rs-arrow">→</span>
              <span className="rs-new-val">₹{newCoffeeRate}</span>
            </div>
          </div>
        </div>

        <p className="rs-modal-timestamp">
          🕐 Updated on {new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>

        <button className="rs-done-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

export default function RatesSettings({ teaRate, setTeaRate, coffeeRate, setCoffeeRate }) {
  const [localTea, setLocalTea] = useState(teaRate);
  const [localCoffee, setLocalCoffee] = useState(coffeeRate);
  const [showModal, setShowModal] = useState(false);
  const [savedRates, setSavedRates] = useState({ tea: teaRate, coffee: coffeeRate });

  const handleTeaChange = (e) => {
    const val = e.target.value.replace(/^0+(?=\d)/, '');
    if (val === '' || /^\d+$/.test(val)) setLocalTea(val === '' ? 0 : Number(val));
  };

  const handleCoffeeChange = (e) => {
    const val = e.target.value.replace(/^0+(?=\d)/, '');
    if (val === '' || /^\d+$/.test(val)) setLocalCoffee(val === '' ? 0 : Number(val));
  };

  const handleSave = () => {
    setSavedRates({ tea: teaRate, coffee: coffeeRate }); // old rates before save
    setTeaRate(localTea);
    setCoffeeRate(localCoffee);
    setShowModal(true);
  };

  const isDirty = localTea !== teaRate || localCoffee !== coffeeRate;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Rates & Settings</h2>
          <p className="text-muted">Configure the default rates for your beverages.</p>
        </div>
      </div>

      <div className="card rs-card">
        <h3 className="rs-card-title">Current Rates (Per Cup)</h3>

        <div className="rs-inputs-row">
          <div className="rs-input-group">
            <div className="rs-input-icon">🍵</div>
            <div className="rs-input-body">
              <label className="form-label">Tea Rate (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-input rs-input"
                value={localTea}
                onChange={handleTeaChange}
              />
            </div>
          </div>

          <div className="rs-input-group">
            <div className="rs-input-icon">☕</div>
            <div className="rs-input-body">
              <label className="form-label">Coffee Rate (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-input rs-input"
                value={localCoffee}
                onChange={handleCoffeeChange}
              />
            </div>
          </div>
        </div>

        <div className="rs-info-box">
          ℹ️ Changing rates will automatically update the total expense calculations for all existing entries.
        </div>

        <div className="rs-footer">
          {isDirty && (
            <span className="rs-unsaved-badge">⚠️ Unsaved changes</span>
          )}
          <button
            className={`btn rs-save-btn ${!isDirty ? 'rs-save-btn-disabled' : ''}`}
            onClick={handleSave}
            disabled={!isDirty}
          >
            💾 Update Rates
          </button>
        </div>
      </div>

      {showModal && (
        <SuccessModal
          oldTeaRate={savedRates.tea}
          oldCoffeeRate={savedRates.coffee}
          newTeaRate={localTea}
          newCoffeeRate={localCoffee}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
