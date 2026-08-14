import React, { useState } from 'react';
import DailyTable from '../components/DailyTable';
import AddEntryModal from '../components/AddEntryModal';
import './Page.css';

export default function DailyEntry({ entries, onAddEntry, onEditEntry, onDeleteEntry, teaRate, coffeeRate, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Daily Entries</h2>
          <p className="text-muted">Manage your daily tea and coffee consumption.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}>
          + Add Entry
        </button>
      </div>

      <div className="card">
        <DailyTable 
          entries={entries} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          currentUser={currentUser} 
        />
      </div>

      {isModalOpen && (
        <AddEntryModal 
          onClose={handleModalClose}
          onSave={onAddEntry}
          onEdit={onEditEntry}
          editingEntry={editingEntry}
          existingEntries={entries}
          teaRate={teaRate}
          coffeeRate={coffeeRate}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
