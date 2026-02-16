import React, { useState } from 'react';
import './AppShell.css';

const RECENT_CLAIMS_LIMIT = 10;

export default function AppShell({ children, pageTitle, recentClaims = [], selectedClaim, onSelectClaim, onGoToClaims, onSignOut }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const recent = recentClaims.slice(0, RECENT_CLAIMS_LIMIT);

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

      <aside className={`app-shell-sidebar${sidebarCollapsed ? ' collapsed' : ''}`} aria-label="Navigation">
        <button
          className="app-shell-sidebar-toggle"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setSidebarCollapsed((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="4" width="24" height="2.5" rx="1.25" fill="#111" />
            <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#111" />
            <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#111" />
          </svg>
        </button>
        {!sidebarCollapsed && (
          <nav className="app-shell-nav">
          <button
            type="button"
            className="app-shell-nav-item app-shell-nav-item--active"
            onClick={onGoToClaims}
            aria-current={!selectedClaim ? 'page' : undefined}
          >
            Claims
          </button>
        </nav>
        )}
        {!sidebarCollapsed && recent.length > 0 && (
          <div className="app-shell-recent">
            <h2 className="app-shell-recent-title">Recent</h2>
            <ul className="app-shell-recent-list" role="list">
              {recent.map((claim) => (
                <li key={claim.id}>
                  <button
                    type="button"
                    className={`app-shell-recent-item ${selectedClaim?.id === claim.id ? 'app-shell-recent-item--active' : ''}`}
                    onClick={() => onSelectClaim?.(claim)}
                  >
                    <span className="app-shell-recent-id">#{claim.id}</span>
                    <span className="app-shell-recent-subject" title={claim.email_subject}>
                      {claim.email_subject || 'No subject'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="app-shell-main" role="main">
        {pageTitle && (
          <h1 className="app-shell-page-title">{pageTitle}</h1>
        )}
        {children}
      </main>
    </div>
  );
}
