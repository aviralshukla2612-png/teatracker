import React, { useState, useEffect } from 'react';
import ExpenseBreakdown from '../components/ExpenseBreakdown';
import './MonthlySummary.css';

export default function MonthlySummary({ entries, teaRate, coffeeRate }) {
  // Extract unique month-year strings (e.g., "Aug 2026")
  const availableMonths = [...new Set(entries.map(e => e.date.split(' ').slice(1).join(' ')))];
  
  const currentMonthYear = new Date().toLocaleString('en-IN', { month: 'short', year: 'numeric' });
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

  useEffect(() => {
    if (availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  const filteredEntries = entries.filter(e => e.date.endsWith(selectedMonth));

  const totalTea = filteredEntries.reduce((sum, entry) => sum + entry.tea, 0);
  const totalCoffee = filteredEntries.reduce((sum, entry) => sum + entry.coffee, 0);
  const totalCups = totalTea + totalCoffee;

  const teaExpense = totalTea * teaRate;
  const coffeeExpense = totalCoffee * coffeeRate;
  const totalExpense = teaExpense + coffeeExpense;

  // For the chart
  const maxAmount = filteredEntries.length > 0 ? Math.max(...filteredEntries.map(e => e.amount)) : 0;

  const exportToCSV = () => {
    let csv = "Date,Tea (Cups),Coffee (Cups),Total Amount (Rs)\n";
    // Ensure entries are sorted by date string conceptually or just printed as they are (they are already sorted desc usually)
    filteredEntries.forEach(e => {
      // Escape commas in date if any
      const safeDate = e.date.replace(/,/g, '');
      csv += `="${safeDate}",${e.tea},${e.coffee},${e.amount}\n`;
    });
    csv += `TOTAL,${totalTea},${totalCoffee},${totalExpense}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TeaTrack_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="monthly-summary">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(e.target.value)}
              className="greeting"
              style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px', fontSize: '20px', cursor: 'pointer', outline: 'none' }}
            >
              {availableMonths.length === 0 && <option value={selectedMonth}>{selectedMonth}</option>}
              {availableMonths.map(m => (
                <option key={m} value={m}>{m} Summary</option>
              ))}
            </select>
          </div>
          <p className="subtitle" style={{ marginTop: '8px' }}>Detailed breakdown of your consumption</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={exportToCSV}>📊 Export Excel</button>
          <button className="btn btn-primary" onClick={() => window.print()}>📥 Export PDF</button>
        </div>
      </div>

      <div className="summary-grid">
        <div className="card breakdown-card">
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
        <div className="card chart-card">
          <h3 className="chart-title">Daily Trend</h3>
          <div className="css-chart-container">
            {filteredEntries.length === 0 ? (
              <div className="no-data">No data available for {selectedMonth}</div>
            ) : (
              <div className="css-chart">
                {filteredEntries.map((entry, idx) => {
                  const heightPct = maxAmount > 0 ? (entry.amount / maxAmount) * 100 : 0;
                  const dateLabel = entry.date.split(' ')[0]; // just the day number
                  return (
                    <div key={entry.id || idx} className="bar-container" title={`${entry.date}: ₹${entry.amount}`}>
                      <div className="bar-wrapper">
                        <div className="bar" style={{ height: `${heightPct}%` }}>
                          <span className="bar-tooltip">₹{entry.amount}</span>
                        </div>
                      </div>
                      <span className="bar-label">{dateLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
