import React, { useState } from 'react';
import './FNOLDashboard.css';

const tabs = ['Summary', 'Email Source', 'Extracted Data', 'Attachments'];

export default function FNOLDashboard({ claims, selectedClaim, onSelectClaim }) {
  const [activeTab, setActiveTab] = useState('Extracted Data');

  return (
    <div className="fnol-dashboard">
      <aside className="fnol-sidebar">
        <h2>Recent Claims</h2>
        <ul className="fnol-claim-list">
          {claims.map(claim => (
            <li
              key={claim.id}
              className={selectedClaim && claim.id === selectedClaim.id ? 'selected' : ''}
              onClick={() => onSelectClaim(claim)}
            >
              <div>
                <div className="claim-title">Claim #{claim.id}: {claim.email_subject}</div>
                <div style={{ fontSize: '0.95rem', color: '#888' }}>{claim.claim_type || ''}</div>
              </div>
              <div className={`claim-status ${claim.status ? claim.status.toLowerCase() : ''}`}>{claim.status || 'Status'}</div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="fnol-main">
        <div className="fnol-header">
          <div className="fnol-title">Claim Details - #{selectedClaim ? selectedClaim.id : ''}</div>
          <div className="fnol-profile">
            <div className="fnol-profile-icon" />
            <div className="fnol-profile-name">Joan profile</div>
          </div>
        </div>
        <div className="fnol-tabs">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`fnol-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >{tab}</div>
          ))}
        </div>
        {activeTab === 'Extracted Data' && selectedClaim && (
          <div className="fnol-details-grid">
            <label>Policy Holder</label>
            <input value={selectedClaim.extracted_fields?.policy_holder || ''} readOnly />
            <label>Policy Number</label>
            <input value={selectedClaim.extracted_fields?.policy_number || ''} readOnly />
            <label>Incident Date</label>
            <input value={selectedClaim.extracted_fields?.incident_date || ''} readOnly />
            <label>Vehicle Model</label>
            <input value={selectedClaim.extracted_fields?.vehicle_model || ''} readOnly />
            <label>Damage Description</label>
            <input value={selectedClaim.extracted_fields?.damage_description || ''} readOnly />
            <label>Estimated Cost</label>
            <input value={selectedClaim.extracted_fields?.estimated_cost || ''} readOnly />
          </div>
        )}
        {activeTab === 'Summary' && selectedClaim && (
          <div style={{ marginBottom: '24px' }}>
            <strong>Summary:</strong> {selectedClaim.extracted_fields?.summary || '—'}
          </div>
        )}
        {activeTab === 'Email Source' && selectedClaim && (
          <div style={{ marginBottom: '24px' }}>
            <strong>Email Subject:</strong> {selectedClaim.email_subject}<br />
            <strong>Email Body:</strong>
            <pre>{selectedClaim.email_body}</pre>
          </div>
        )}
        {activeTab === 'Attachments' && selectedClaim && (
          <div style={{ marginBottom: '24px' }}>
            <strong>Attachments:</strong> {selectedClaim.attachments?.length ? selectedClaim.attachments.join(', ') : '—'}
          </div>
        )}
        {selectedClaim && (
          <button className="fnol-view-email-btn">View Original Email</button>
        )}
      </main>
    </div>
  );
}
