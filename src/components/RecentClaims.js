import React from 'react';
import './RecentClaims.css';

export default function RecentClaims({ claims, onView }) {
  return (
    <div className="recent-claims-container">
      <div className="recent-claims-header">
        <span className="recent-claims-title">Recent Claims</span>
      </div>
      <table className="recent-claims-table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Subject</th>
            <th>Date Received</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim.id}>
              <td>#{claim.id}</td>
              <td>{claim.email_subject}</td>
              <td>{claim.created_at ? claim.created_at.split('T')[0] : ''}</td>
              <td>
                <span className={`status-badge status-${(claim.status || '').toLowerCase()}`}>{claim.status || 'New'}</span>
              </td>
              <td>
                <button className="view-btn" onClick={() => onView(claim)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
