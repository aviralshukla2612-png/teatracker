import React, { useState } from 'react';
import DailyTable from '../components/DailyTable';
import AddEntryModal from '../components/AddEntryModal';
import './Page.css';

export default function DailyEntry({ entries, onAddEntry, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Daily Entries</h2>
          <p className="text-muted">Manage your daily tea and coffee consumption.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Entry
        </button>
      </div>

      <div className="card">
        <DailyTable entries={entries} />
      </div>

      {isModalOpen && (
        <AddEntryModal 
          onClose={() => setIsModalOpen(false)}
          onAdd={onAddEntry}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
