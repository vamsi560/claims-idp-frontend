import React from 'react';
import './ClaimDetails.css';

export default function ClaimDetails({ claim, onBack }) {
  if (!claim) return null;
  return (
    <div className="claim-details-container">
      <div className="claim-details-card">
        <div className="claim-details-section-title">Extracted Details</div>
        <div className="claim-details-grid">
          {claim.extracted_fields && Object.keys(claim.extracted_fields).length > 0 ? (
            Object.entries(claim.extracted_fields).map(([key, value]) => (
              <div key={key}>
                <span className="claim-info-label">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <span className="claim-info-value">{value || '—'}</span>
              </div>
            ))
          ) : (
            <span className="claim-info-value">No extracted fields</span>
          )}
        </div>
      </div>
      <div className="claim-details-card">
        <div className="claim-details-section-title">Attachments</div>
        <ul className="claim-attachments-list">
          {claim.attachments && claim.attachments.length > 0 ? (
            claim.attachments.map((att, idx) => (
              <li key={idx} className="claim-attachment-item">{att}</li>
            ))
          ) : (
            <li className="claim-attachment-item">No attachments</li>
          )}
        </ul>
      </div>
      <button className="view-original-btn">View Original Email</button>
    </div>
  );
}
