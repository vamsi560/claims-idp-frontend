import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ onNavigate, activePage }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`sidebar-nav${collapsed ? ' collapsed' : ''}`}>
      <button
        className="sidebar-nav-toggle"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={() => setCollapsed((v) => !v)}
        style={{ margin: '12px auto', background: '#20406a', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="4" width="24" height="2.5" rx="1.25" fill="#111" />
          <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#111" />
          <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#111" />
        </svg>
      </button>
      {!collapsed && (
        <nav>
          <button
            className={`sidebar-link${activePage === 'dashboard' ? ' active' : ''}`}
            onClick={() => { onNavigate('dashboard'); navigate('/dashboard'); }}
          >
            <span style={{ marginRight: 12, verticalAlign: 'middle' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="#111"/>
                <rect x="14" y="3" width="7" height="7" rx="2" fill="#111"/>
                <rect x="3" y="14" width="7" height="7" rx="2" fill="#111"/>
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#111"/>
              </svg>
            </span>
            Dashboard
          </button>
          <button
            className={`sidebar-link${activePage === 'claims' ? ' active' : ''}`}
            onClick={() => { onNavigate('claims'); navigate('/claims'); }}
          >
            <span style={{ marginRight: 12, verticalAlign: 'middle' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v2H9V9zm0 4h6v2H9v-2z" fill="#111"/>
              </svg>
            </span>
            Recent Claims
          </button>
        </nav>
      )}
    </aside>
  );
}
