import React, { useState } from 'react';
import './ClaimDetails.css';

const FIELD_SECTIONS = {
  Summary: ['summary'],
  'Intent & claim type': ['intent', 'reported_by_and_main_contact_are_same', 'claim_type'],
  Contact: ['reporting_contact', 'best_contact', 'reply_to_emails'],
  'Insured & claimants': ['insured', 'claimants', 'claimants_count', 'injured_person_contact', 'plaintiff'],
  Policy: ['policy'],
  Loss: ['loss'],
  'Acknowledgment & legal': ['acknowledgment', 'matter', 'lawsuit_or_complaint_received'],
};

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatValue(value) {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function FieldRow({ label, value }) {
  const display = formatValue(value);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  return (
    <div className="claim-details-field">
      <span className="claim-info-label">{formatLabel(label)}</span>
      <span className="claim-info-value">
        {isObject ? (
          <pre className="claim-details-nested">{display}</pre>
        ) : (
          display
        )}
      </span>
    </div>
  );
}

function sectionId(title) {
  return 'section-' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function SectionBlock({ title, entries }) {
  if (!entries.length) return null;
  const id = sectionId(title);
  return (
    <section className="claim-details-section" aria-labelledby={id}>
      <h2 id={id} className="claim-details-section-title">
        {title}
      </h2>
      <div className="claim-details-grid">
        {entries.map(([key, value]) => (
          <FieldRow key={key} label={key} value={value} />
        ))}
      </div>
    </section>
  );
}

export default function ClaimDetails({ claim, onBack, onEdit }) {
  const [showOriginalEmail, setShowOriginalEmail] = useState(false);

  if (!claim) return null;

  const fields = claim.extracted_fields || {};
  const allKeys = new Set(Object.keys(fields));
  const sectioned = {};
  Object.entries(FIELD_SECTIONS).forEach(([sectionName, keys]) => {
    sectioned[sectionName] = keys
      .filter((k) => fields.hasOwnProperty(k))
      .map((k) => {
        allKeys.delete(k);
        return [k, fields[k]];
      });
  });
  const otherKeys = Array.from(allKeys).map((k) => [k, fields[k]]);

  return (
    <div className="claim-details-container">
      <header className="claim-details-header">
        <nav className="claim-details-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="btn btn-secondary back-btn"
            onClick={onBack}
            aria-label="Back to claims list"
          >
            Back
          </button>
          <span className="claim-details-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="claim-details-breadcrumb-current">Claim #{claim.id}</span>
        </nav>
        <div className="claim-details-actions">
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onEdit}
              aria-label="Edit claim"
            >
              Edit
            </button>
          )}
        </div>
      </header>

      <div className="claim-details-card claim-details-extracted">
        <h2 className="claim-details-card-heading">Extracted Details</h2>
        {Object.keys(fields).length === 0 ? (
          <p className="claim-details-empty">No extracted fields</p>
        ) : (
          <>
            {Object.entries(sectioned).map(([title, entries]) => (
              <SectionBlock key={title} title={title} entries={entries} />
            ))}
            {otherKeys.length > 0 && (
              <SectionBlock title="Other" entries={otherKeys} />
            )}
          </>
        )}
      </div>

      <div className="claim-details-card">
        <h2 className="claim-details-section-title">Attachments</h2>
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

      <div className="claim-details-original">
        <button
          type="button"
          className="btn btn-secondary view-original-btn"
          onClick={() => setShowOriginalEmail((v) => !v)}
          aria-expanded={showOriginalEmail}
          aria-controls="original-email-content"
        >
          {showOriginalEmail ? 'Hide original email' : 'View original email'}
        </button>
        {showOriginalEmail && (
          <div
            id="original-email-content"
            className="claim-details-original-content"
            role="region"
            aria-label="Original email"
          >
            <div className="claim-details-original-block">
              <span className="claim-info-label">Subject</span>
              <p className="claim-info-value">{claim.email_subject || '—'}</p>
            </div>
            <div className="claim-details-original-block">
              <span className="claim-info-label">Body</span>
              <pre className="claim-details-email-body">{claim.email_body || '—'}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
