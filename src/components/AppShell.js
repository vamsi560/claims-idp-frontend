import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppShell.css';

const RECENT_CLAIMS_LIMIT = 10;

export default function AppShell({ children, pageTitle, recentClaims = [], selectedClaim, onSelectClaim, onGoToClaims, onSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  return (
    <div className="app-shell">
      <header className="app-shell-topbar" role="banner">
        <div className="app-shell-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src="/images/ValueMomentum_logo.png" alt="ValueMomentum Logo" style={{ height: 40, width: 'auto' }} />
          <span className="app-shell-brand">Claims Workbench</span>
        </div>
        <div className="app-shell-topbar-right">
          <div className="app-shell-user-wrap">
            <button
              type="button"
              className="app-shell-user-btn"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <span className="app-shell-user-avatar" aria-hidden="true" />
              <span className="app-shell-user-label">Account</span>
            </button>
            {userMenuOpen && (
              <>
                <div
                  className="app-shell-user-backdrop"
                  aria-hidden="true"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="app-shell-user-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="app-shell-user-menu-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut?.();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <nav className="app-shell-tabs-bar" aria-label="Main tabs">
        <button
          className={`app-shell-tab${location.pathname === '/' || location.pathname === '/dashboard' ? ' app-shell-tab-active' : ''}`}
          onClick={() => navigate('/dashboard')}
          aria-current={location.pathname === '/' || location.pathname === '/dashboard' ? 'page' : undefined}
          type="button"
        >
          Dashboard
        </button>
        <button
          className={`app-shell-tab${location.pathname === '/claims' ? ' app-shell-tab-active' : ''}`}
          onClick={() => navigate('/claims')}
          aria-current={location.pathname === '/claims' ? 'page' : undefined}
          type="button"
        >
          Recent Claims
        </button>
      </nav>
      <main className="app-shell-main" role="main">
        {children}
      </main>
    </div>
  );
}
