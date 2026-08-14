import React, { useState } from 'react';
import './Reports.css';
import './Page.css';

export default function Reports({ entries }) {
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');

  const totalTea = entries.reduce((s, e) => s + e.tea, 0);
  const totalCoffee = entries.reduce((s, e) => s + e.coffee, 0);
  const totalExpense = entries.reduce((s, e) => s + e.amount, 0);
  const totalCups = totalTea + totalCoffee;
  const avgCupsPerDay = entries.length > 0 ? (totalCups / entries.length).toFixed(1) : 0;
  const avgExpensePerDay = entries.length > 0 ? (totalExpense / entries.length).toFixed(0) : 0;
  const highestDay = entries.length > 0
    ? entries.reduce((max, e) => (e.totalCups > max.totalCups ? e : max), entries[0])
    : null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filtered = entries.filter(e => {
    if (filterMin !== '' && e.amount < Number(filterMin)) return false;
    if (filterMax !== '' && e.amount > Number(filterMax)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'date') {
      aVal = new Date(a.date);
      bVal = new Date(b.date);
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const arrow = (field) => {
    if (sortField !== field) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="reports-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>📊 Reports</h2>
          <p className="text-muted">Detailed analytics and summary of all entries</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>📥 Export PDF</button>
      </div>

      {/* Summary KPI Row */}
      <div className="reports-kpi-row">
        <div className="kpi-card">
          <p className="kpi-label">Total Tea</p>
          <p className="kpi-value tea-color">{totalTea} <span className="kpi-unit">cups</span></p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Coffee</p>
          <p className="kpi-value coffee-color">{totalCoffee} <span className="kpi-unit">cups</span></p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Cups</p>
          <p className="kpi-value">{totalCups}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Total Expense</p>
          <p className="kpi-value green-color">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Avg Cups / Day</p>
          <p className="kpi-value">{avgCupsPerDay}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Avg Expense / Day</p>
          <p className="kpi-value green-color">₹{avgExpensePerDay}</p>
        </div>
      </div>

      {/* Highlight Row */}
      {highestDay && (
        <div className="card reports-highlight">
          <span className="highlight-badge">🏆 Highest Consumption Day</span>
          <span className="highlight-text">
            {highestDay.date} — {highestDay.totalCups} cups &nbsp;|&nbsp; ₹{highestDay.amount}
          </span>
        </div>
      )}

      {/* Filter Row */}
      <div className="card reports-filter">
        <span className="filter-label">Filter by Expense (₹):</span>
        <input
          type="number"
          className="form-input filter-input"
          placeholder="Min"
          value={filterMin}
          onChange={e => setFilterMin(e.target.value)}
        />
        <span style={{color: 'var(--text-muted)'}}>to</span>
        <input
          type="number"
          className="form-input filter-input"
          placeholder="Max"
          value={filterMax}
          onChange={e => setFilterMax(e.target.value)}
        />
        {(filterMin !== '' || filterMax !== '') && (
          <button className="btn btn-outline" onClick={() => { setFilterMin(''); setFilterMax(''); }}>
            Clear
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="card reports-table-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <h3>All Entries</h3>
          <span className="text-muted" style={{fontSize:'13px'}}>{sorted.length} records</span>
        </div>
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">Date{arrow('date')}</th>
                <th onClick={() => handleSort('tea')} className="sortable">Tea (Cups){arrow('tea')}</th>
                <th onClick={() => handleSort('coffee')} className="sortable">Coffee (Cups){arrow('coffee')}</th>
                <th onClick={() => handleSort('totalCups')} className="sortable">Total Cups{arrow('totalCups')}</th>
                <th onClick={() => handleSort('amount')} className="sortable">Expense (₹){arrow('amount')}</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data-cell">No entries match your filter.</td>
                </tr>
              ) : (
                sorted.map((e, i) => (
                  <tr key={e.id || i} className={i % 2 === 0 ? 'even-row' : ''}>
                    <td>{e.date}</td>
                    <td><span className="tea-badge">{e.tea}</span></td>
                    <td><span className="coffee-badge">{e.coffee}</span></td>
                    <td><strong>{e.totalCups}</strong></td>
                    <td><strong>₹{e.amount?.toLocaleString()}</strong></td>
                    <td className="text-muted">{e.addedBy || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="table-footer-row">
                <td><strong>Total</strong></td>
                <td><strong>{sorted.reduce((s, e) => s + e.tea, 0)}</strong></td>
                <td><strong>{sorted.reduce((s, e) => s + e.coffee, 0)}</strong></td>
                <td><strong>{sorted.reduce((s, e) => s + e.totalCups, 0)}</strong></td>
                <td><strong>₹{sorted.reduce((s, e) => s + e.amount, 0).toLocaleString()}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
