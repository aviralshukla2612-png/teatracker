import React, { useState } from 'react';
import chaiVideo from '../assets/Pouring_masala_chai_into_kulhad_202608121811.mp4';
import './Sidebar.css';

export default function Sidebar({ currentView, setCurrentView, onLogout, currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',       icon: '🏠' },
    { id: 'dailyEntry', label: 'Daily Entry',      icon: '📝' },
    { id: 'monthly',    label: 'Monthly Summary',  icon: '📅' },
    ...(currentUser === 'Super Admin'
      ? [
          { id: 'rates', label: 'Rates & Settings', icon: '⚙️' },
          { id: 'users', label: 'Sub Admins',       icon: '👥' }
        ]
      : []),
    { id: 'reports',    label: 'Reports',          icon: '📊' },
  ];

  const handleNav = (id) => {
    setCurrentView(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-brand">
          <div className="sidebar-logo sidebar-logo-sm">
            <video src={chaiVideo} autoPlay loop muted playsInline className="sidebar-logo-video" />
          </div>
          <span className="mobile-brand-name">Tea &amp; Coffee</span>
        </div>
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <video src={chaiVideo} autoPlay loop muted playsInline className="sidebar-logo-video" />
          </div>
          <div>
            <h2>Tea &amp; Coffee</h2>
            <p>Expense Tracker</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item logout-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
