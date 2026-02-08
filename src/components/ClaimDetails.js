import React from 'react';
import './ClaimDetails.css';

export default function ClaimDetails({ claim, onBack }) {
  if (!claim) return null;
  return (
    <div className="claim-details-container">
      <div className="claim-details-header">
        <span className="claim-details-title">Claim Details - #{claim.id}</span>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
      <div className="claim-info-card">
        <div className="claim-info-row">
          <div>
            <span className="claim-info-label">Policy Number</span>
            <span className="claim-info-value">{claim.extracted_fields?.policy_number || '—'}</span>
          </div>
          <div>
            <span className="claim-info-label">Incident Date</span>
            <span className="claim-info-value">{claim.extracted_fields?.incident_date || '—'}</span>
          </div>
        </div>
      </div>
      <div className="claim-details-card">
        <div className="claim-details-section-title">Extracted Details</div>
        <div className="claim-details-grid">
          <div>
            <span className="claim-info-label">Vehicle Model</span>
            <span className="claim-info-value">{claim.extracted_fields?.vehicle_model || '—'}</span>
          </div>
          <div>
            <span className="claim-info-label">Damage Description</span>
            <span className="claim-info-value">{claim.extracted_fields?.damage_description || '—'}</span>
          </div>
          <div>
            <span className="claim-info-label">Estimated Cost</span>
            <span className="claim-info-value">{claim.extracted_fields?.estimated_cost || '—'}</span>
          </div>
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
