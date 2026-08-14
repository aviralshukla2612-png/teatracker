import React, { useState, useEffect } from 'react';
import './AddEntryModal.css';

export default function AddEntryModal({ onClose, onSave, onEdit, teaRate, coffeeRate, existingEntries, currentUser, editingEntry }) {
  const isEditMode = Boolean(editingEntry);

  const getTodayFormatted = () => {
    return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const [date, setDate] = useState(isEditMode ? editingEntry.date : getTodayFormatted());
  const [tea, setTea] = useState(isEditMode ? editingEntry.tea : 0);
  const [coffee, setCoffee] = useState(isEditMode ? editingEntry.coffee : 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setTea(editingEntry.tea);
      setCoffee(editingEntry.coffee);
    }
  }, [editingEntry]);

  const teaCost = tea * teaRate;
  const coffeeCost = coffee * coffeeRate;
  const totalAmount = teaCost + coffeeCost;

  const handleSave = () => {
    if (!isEditMode) {
      // Check for duplicate dates only when adding new
      const exists = existingEntries.some(entry => entry.date === date);
      if (exists) {
        setError(`An entry for ${date} has already been added.`);
        return;
      }

      onSave({
        id: Date.now().toString(),
        date,
        tea,
        coffee,
        totalCups: tea + coffee,
        amount: totalAmount,
        // addedBy is attached in App.jsx
      });
    } else {
      onEdit({
        ...editingEntry,
        date,
        tea,
        coffee,
        totalCups: tea + coffee,
        amount: totalAmount,
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{isEditMode ? '✏️ Edit Entry' : 'Add Daily Consumption'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="text" 
              className="form-input" 
              value={date} 
              readOnly={currentUser !== 'Super Admin'}
              style={currentUser !== 'Super Admin' ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' } : {}}
              onChange={e => {
                setDate(e.target.value);
                setError('');
              }} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tea Cups (₹{teaRate}/cup)</label>
            <input 
              type="number" 
              className="form-input" 
              value={tea} 
              min="0"
              onChange={e => setTea(parseInt(e.target.value) || 0)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Coffee Cups (₹{coffeeRate}/cup)</label>
            <input 
              type="number" 
              className="form-input" 
              value={coffee} 
              min="0"
              onChange={e => setCoffee(parseInt(e.target.value) || 0)} 
            />
          </div>

          <div className="calculation-preview">
            <div className="calc-row">
              <span>Tea</span>
              <span>₹{teaCost}</span>
            </div>
            <div className="calc-row">
              <span>Coffee</span>
              <span>₹{coffeeCost}</span>
            </div>
            <div className="calc-row calc-total">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="calc-equation">
              {tea} × ₹{teaRate} + {coffee} × ₹{coffeeRate} = ₹{totalAmount}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button 
            className={`btn ${currentUser !== 'Super Admin' && isEditMode && editingEntry?.addedBy !== currentUser ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleSave}
            disabled={currentUser !== 'Super Admin' && isEditMode && editingEntry?.addedBy !== currentUser}
          >
            {currentUser !== 'Super Admin' && isEditMode && editingEntry?.addedBy !== currentUser 
              ? '🔒 View Only' 
              : isEditMode ? '💾 Save Changes' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
