
import React, { useState } from 'react';
import './FNOLDashboard.css';

const tabs = ['Summary', 'Email Source', 'Extracted Data', 'Attachments'];

function renderExtractedFields(fields) {
  if (!fields || typeof fields !== 'object') return <div>No extracted fields.</div>;
  return (
    <div className="fnol-details-grid">
      {Object.entries(fields).map(([key, value]) => (
        <React.Fragment key={key}>
          <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
          <input value={typeof value === 'object' ? JSON.stringify(value) : value ?? ''} readOnly />
        </React.Fragment>
      ))}
    </div>
  );
}

export default function FNOLDashboard({ claims, selectedClaim, onSelectClaim }) {
  const [activeTab, setActiveTab] = useState('Extracted Data');

  return (
    <div className="fnol-dashboard dark-blue-bg">
      <aside className="fnol-sidebar dark-blue-bg">
        <h2 className="gold-text">Recent Claims</h2>
        <ul className="fnol-claim-list">
          {claims.map(claim => (
            <li
              key={claim.id}
              className={selectedClaim && claim.id === selectedClaim.id ? 'selected' : ''}
              onClick={() => onSelectClaim(claim)}
            >
              <div>
                <div className="claim-title gold-text">Claim #{claim.id}: {claim.email_subject}</div>
                <div style={{ fontSize: '0.95rem', color: '#fff' }}>{claim.claim_type || ''}</div>
              </div>
              <div className={`claim-status ${claim.status ? claim.status.toLowerCase() : ''}`}>{claim.status || 'Status'}</div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="fnol-main white-bg">
        <div className="fnol-header">
          <div className="fnol-title gold-text">Claim Details - #{selectedClaim ? selectedClaim.id : ''}</div>
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
          <>
            {renderExtractedFields(selectedClaim.extracted_fields)}
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
              <button className="fnol-view-email-btn">Save</button>
              <button className="fnol-view-email-btn">Submit</button>
            </div>
          </>
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
            <strong>Attachments:</strong>
            {Array.isArray(selectedClaim.attachments) && selectedClaim.attachments.length ? (
              <ul>
                {selectedClaim.attachments.map(att => (
                  typeof att === 'object' && att.id && att.filename && att.blob_url ? (
                    <li key={att.id}>
                      <a href={att.blob_url} target="_blank" rel="noopener noreferrer">{att.filename}</a> ({att.doc_type})
                    </li>
                  ) : null
                ))}
              </ul>
            ) : '—'}
          </div>
        )}
        {/* No View Original Email button, replaced by Save/Submit */}
      </main>
    </div>
  );
}
