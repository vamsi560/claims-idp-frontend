import React from 'react';
import Sidebar from './Sidebar';
import './MainLayout.css';

export default function MainLayout({ children, activePage, onNavigate }) {
  return (
    <div className="main-layout">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  );
}
