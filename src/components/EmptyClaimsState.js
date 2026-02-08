import React from 'react';
import './EmptyClaimsState.css';

export default function EmptyClaimsState({ title = 'No claims yet', message = "New claims will appear here when they're created." }) {
  return (
    <div className="empty-claims-state" role="status" aria-label={title}>
      <div className="empty-claims-icon" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h2 className="empty-claims-title">{title}</h2>
      <p className="empty-claims-message">{message}</p>
    </div>
  );
}
