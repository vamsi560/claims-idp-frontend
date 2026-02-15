import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ onNavigate, activePage }) {
  const navigate = useNavigate();
  return (
    <aside className="sidebar-nav">
      <nav>
        <button
          className={`sidebar-link${activePage === 'dashboard' ? ' active' : ''}`}
          onClick={() => { onNavigate('dashboard'); navigate('/dashboard'); }}
        >
          Dashboard
        </button>
        <button
          className={`sidebar-link${activePage === 'claims' ? ' active' : ''}`}
          onClick={() => { onNavigate('claims'); navigate('/claims'); }}
        >
          Recent Claims
        </button>
      </nav>
    </aside>
  );
}
