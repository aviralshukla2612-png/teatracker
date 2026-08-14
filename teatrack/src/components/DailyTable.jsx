import React from 'react';
import './DailyTable.css';

export default function DailyTable({ entries, onEdit, onDelete, currentUser }) {
  return (
    <div className="table-responsive">
      <table className="daily-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tea</th>
            <th>Coffee</th>
            <th>Total</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted" style={{padding: '24px'}}>No entries yet.</td>
            </tr>
          ) : (
            entries.map((entry, idx) => (
              <tr key={entry.id || idx}>
                <td>
                  <span className="entry-date">{entry.date}</span>
                  <div className="entry-sub">Added by: {entry.addedBy || '—'}</div>
                </td>
                <td><span className="tea-count">{entry.tea}</span></td>
                <td><span className="coffee-count">{entry.coffee}</span></td>
                <td><strong>{entry.totalCups}</strong></td>
                <td><span className="amount-badge">₹{entry.amount}</span></td>
                <td>
                  <div className="action-cell">
                    {(currentUser === 'Super Admin' || entry.addedBy === currentUser) && (
                      <>
                        <button
                          className="tbl-btn tbl-edit-btn"
                          title="Edit"
                          onClick={() => onEdit && onEdit(entry)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="tbl-btn tbl-delete-btn"
                          title="Delete"
                          onClick={() => onDelete && onDelete(entry.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/>
                            <path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
