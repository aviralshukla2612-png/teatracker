import React from 'react';
import './Page.css';

export default function ExportData({ entries }) {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "teatrack_export.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Export Data</h2>
          <p className="text-muted">Download your data for backup or external use.</p>
        </div>
      </div>
      <div className="card">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <h3>JSON Export</h3>
            <p className="text-muted" style={{marginTop: '4px', fontSize: '14px'}}>Export all your entries as a JSON file.</p>
          </div>
          <button className="btn btn-primary" onClick={handleExport}>
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
