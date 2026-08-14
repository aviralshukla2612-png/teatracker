import React, { useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import DailyTable from '../components/DailyTable';
import ExpenseBreakdown from '../components/ExpenseBreakdown';
import AddEntryModal from '../components/AddEntryModal';
import rateService from '../services/rateService';
import './Dashboard.css';
import './RatesSettings.css';

export default function Dashboard({ entries, onAddEntry, onEditEntry, onDeleteEntry, teaRate, coffeeRate, setTeaRate, setCoffeeRate, currentUser, onLogout, refreshData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [localTea, setLocalTea] = useState(teaRate);
  const [localCoffee, setLocalCoffee] = useState(coffeeRate);
  const [showRateModal, setShowRateModal] = useState(false);
  const [savedRates, setSavedRates] = useState({ tea: teaRate, coffee: coffeeRate });
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDeleteEntry(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const isRateDirty = localTea !== teaRate || localCoffee !== coffeeRate;

  const handleSaveRates = async () => {
    setIsSaving(true);
    try {
      await rateService.update(localTea, localCoffee);
      setSavedRates({ tea: teaRate, coffee: coffeeRate });
      setTeaRate(localTea);
      setCoffeeRate(localCoffee);
      if (typeof refreshData === 'function') {
        refreshData();
      }
      setShowRateModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update rates');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generate current full date
  const now = new Date();
  const currentMonthYear = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const currentFullDate = now.toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Calculate totals
  const totalTea = entries.reduce((sum, entry) => sum + entry.tea, 0);
  const totalCoffee = entries.reduce((sum, entry) => sum + entry.coffee, 0);
  const totalExpense = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalCups = totalTea + totalCoffee;
  
  const teaExpense = totalTea * teaRate;
  const coffeeExpense = totalCoffee * coffeeRate;

  // Simple Pie Chart Math
  const teaPct = totalExpense > 0 ? Math.round((teaExpense / totalExpense) * 100) : 0;
  const coffeePct = totalExpense > 0 ? Math.round((coffeeExpense / totalExpense) * 100) : 0;

  const exportToCSV = () => {
    const currentMonthYearShort = now.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
    const currentMonthEntries = entries.filter(e => e.date.endsWith(currentMonthYearShort));

    let csv = "Date,Tea (Cups),Coffee (Cups),Total Amount (Rs)\n";
    let mTea = 0, mCoffee = 0, mExpense = 0;

    currentMonthEntries.forEach(e => {
      const safeDate = e.date.replace(/,/g, '');
      // Wrap in ="..." to force Excel to treat it as text and prevent ########
      csv += `="${safeDate}",${e.tea},${e.coffee},${e.amount}\n`;
      mTea += e.tea;
      mCoffee += e.coffee;
      mExpense += e.amount;
    });
    
    csv += `TOTAL,${mTea},${mCoffee},${mExpense}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TeaTrack_${currentMonthYearShort.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header-bar">
        <div className="welcome-text">
          <strong>Welcome back!</strong> Here's your tea & coffee overview for <span className="highlight-text">{currentFullDate}</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline month-btn">📅 {currentFullDate}</button>
          <button className="btn btn-primary" onClick={exportToCSV}>📊 Export Excel</button>
        </div>
      </div>

      <div className="summary-cards-container">
        <SummaryCard 
          title="Total Tea (Cups)" 
          mainValue={totalTea}
          subValue="12% vs July 2026"
          icon="🍵"
          variant="tea"
        />
        <SummaryCard 
          title="Total Coffee (Cups)" 
          mainValue={totalCoffee}
          subValue="8% vs July 2026"
          icon="☕"
          variant="coffee"
        />
        <SummaryCard 
          title="Total Cups" 
          mainValue={totalCups}
          subValue="10% vs July 2026"
          icon="🥛"
          variant="total-cups"
        />
        <SummaryCard 
          title="Total Expense" 
          mainValue={`₹${totalExpense.toLocaleString()}`}
          subValue="15% vs July 2026"
          icon="💰"
          variant="expense"
        />
      </div>

      <div className="dashboard-middle-row">
        <div className="card expense-overview-card">
          <h3 className="card-title">Expense Overview</h3>
          <div className="pie-chart-container">
            <div 
              className="pie-chart" 
              style={{
                background: `conic-gradient(var(--tea-brown) 0% ${teaPct}%, var(--coffee-brown) ${teaPct}% 100%)`
              }}
            >
              <div className="pie-hole">
                <span className="pie-total-label">Total</span>
                <span className="pie-total-value">₹{totalExpense.toLocaleString()}</span>
              </div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="dot dot-tea"></span>
                <div>
                  <div className="legend-label">Tea Expense</div>
                  <div className="legend-value">₹{teaExpense.toLocaleString()} ({teaPct}%)</div>
                </div>
              </div>
              <div className="legend-item">
                <span className="dot dot-coffee"></span>
                <div>
                  <div className="legend-label">Coffee Expense</div>
                  <div className="legend-value">₹{coffeeExpense.toLocaleString()} ({coffeePct}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card rates-card">
          <h3 className="card-title">
            Rates (Per Cup)
            {currentUser !== 'Super Admin' && (
              <span className="rate-lock-badge">🔒 View Only</span>
            )}
          </h3>
          <div className="rates-container">
            <div className="rate-box">
              <div className="rate-icon-container">🍵</div>
              <div className="rate-input-group">
                <label>Tea Rate (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentUser === 'Super Admin' ? localTea : teaRate}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    if (currentUser === 'Super Admin' && (val === '' || /^\d+$/.test(val)))
                      setLocalTea(val === '' ? 0 : Number(val));
                  }}
                  className={`form-input ${currentUser !== 'Super Admin' ? 'rate-readonly' : ''}`}
                  readOnly={currentUser !== 'Super Admin'}
                />
              </div>
            </div>
            <div className="rate-box">
              <div className="rate-icon-container">☕</div>
              <div className="rate-input-group">
                <label>Coffee Rate (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentUser === 'Super Admin' ? localCoffee : coffeeRate}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    if (currentUser === 'Super Admin' && (val === '' || /^\d+$/.test(val)))
                      setLocalCoffee(val === '' ? 0 : Number(val));
                  }}
                  className={`form-input ${currentUser !== 'Super Admin' ? 'rate-readonly' : ''}`}
                  readOnly={currentUser !== 'Super Admin'}
                />
              </div>
            </div>
          </div>
          {currentUser === 'Super Admin' ? (
            <div className="rate-save-row">
              {isRateDirty && <span className="rs-unsaved-badge">⚠️ Unsaved changes</span>}
              <button
                className={`btn rs-save-btn ${!isRateDirty ? 'rs-save-btn-disabled' : ''}`}
                onClick={handleSaveRates}
                disabled={!isRateDirty}
              >
                💾 Update Rates
              </button>
            </div>
          ) : (
            <p className="rate-hint">🔒 Rates are set by Super Admin and cannot be changed here.</p>
          )}
        </div>
      </div>

      <div className="dashboard-bottom-row">
        <div className="table-wrapper">
          <div className="section-header">
            <h3 className="card-title">Daily Consumption</h3>
            <button className="btn btn-primary btn-sm" onClick={() => {
              const todayStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
              const existingToday = entries.find(e => e.date === todayStr);
              if (existingToday) {
                handleEdit(existingToday);
              } else {
                setEditingEntry(null);
                setIsModalOpen(true);
              }
            }}>
              + Add / Edit Today
            </button>
          </div>
          <DailyTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} currentUser={currentUser} />
          <p className="table-hint">💡 Tip: Enter daily consumption regularly to keep accurate track.</p>
        </div>
        
        <div className="table-wrapper">
          <h3 className="card-title">Expense Breakdown</h3>
          <ExpenseBreakdown 
            tea={totalTea} 
            coffee={totalCoffee} 
            teaExpense={teaExpense}
            coffeeExpense={coffeeExpense}
            totalExpense={totalExpense}
            totalCups={totalCups}
            teaRate={teaRate}
            coffeeRate={coffeeRate}
          />
        </div>
      </div>

      {isModalOpen && (
        <AddEntryModal 
          onClose={handleModalClose} 
          onSave={onAddEntry}
          onEdit={onEditEntry}
          teaRate={teaRate}
          coffeeRate={coffeeRate}
          existingEntries={entries}
          currentUser={currentUser}
          editingEntry={editingEntry}
        />
      )}

      {/* Rate Update Success Modal */}
      {showRateModal && (
        <div className="rs-modal-overlay" onClick={() => setShowRateModal(false)}>
          <div className="rs-modal" onClick={e => e.stopPropagation()}>
            <div className="rs-success-ring">
              <div className="rs-checkmark">✓</div>
            </div>
            <h2 className="rs-modal-title">Rates Updated!</h2>
            <p className="rs-modal-sub">The new rates are now active and will reflect across all calculations.</p>
            <div className="rs-rate-comparison">
              <div className="rs-compare-card">
                <span className="rs-compare-icon">🍵</span>
                <p className="rs-compare-label">Tea Rate</p>
                <div className="rs-compare-values">
                  <span className="rs-old-val">₹{savedRates.tea}</span>
                  <span className="rs-arrow">→</span>
                  <span className="rs-new-val">₹{localTea}</span>
                </div>
              </div>
              <div className="rs-compare-card">
                <span className="rs-compare-icon">☕</span>
                <p className="rs-compare-label">Coffee Rate</p>
                <div className="rs-compare-values">
                  <span className="rs-old-val">₹{savedRates.coffee}</span>
                  <span className="rs-arrow">→</span>
                  <span className="rs-new-val">₹{localCoffee}</span>
                </div>
              </div>
            </div>
            <p className="rs-modal-timestamp">
              🕐 Updated on {new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <button className="rs-done-btn" onClick={() => setShowRateModal(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
