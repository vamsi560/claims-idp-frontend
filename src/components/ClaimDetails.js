import React, { useState, useEffect } from 'react';
import { updateFNOL, fetchTPAProviders, assignTPAToClaim, retryTPAPush, simulateTPAUpdate, fetchTPAStatus } from '../api';
import './ClaimDetails.css';
import AttachmentViewer from './AttachmentViewer';

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

function formatPrimitive(value) {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return String(value);
}

function FieldRow({ label, value }) {
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArrayOfObjects = Array.isArray(value) && value.length > 0 && typeof value[0] === 'object';

  if (isArrayOfObjects) {
    return (
      <div className="claim-details-field claim-details-field--nested-group">
        <span className="claim-info-label">{formatLabel(label)}</span>
        <div className="claim-details-nested-list">
          {value.map((item, idx) => (
            <div key={idx} className="claim-details-nested-block">
              {Object.entries(item).map(([k, v]) => {
                const isNestedObj = typeof v === 'object' && v !== null && !Array.isArray(v);
                return (
                  <div key={k} className="claim-details-field">
                    <span className="claim-info-label">{formatLabel(k)}</span>
                    <span className="claim-info-value">
                      {isNestedObj
                        ? (
                          <div className="claim-details-inline-nested">
                            {Object.entries(v).map(([k2, v2]) => (
                              <span key={k2} className="claim-details-inline-pair">
                                {formatLabel(k2)}: {formatPrimitive(v2)}
                              </span>
                            ))}
                          </div>
                          )
                        : formatPrimitive(v)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isObject) {
    return (
      <div className="claim-details-field claim-details-field--nested-group">
        <span className="claim-info-label">{formatLabel(label)}</span>
        <div className="claim-details-nested-block">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="claim-details-field">
              <span className="claim-info-label">{formatLabel(k)}</span>
              <span className="claim-info-value">{formatPrimitive(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="claim-details-field">
      <span className="claim-info-label">{formatLabel(label)}</span>
      <span className="claim-info-value">{formatPrimitive(value)}</span>
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

export default function ClaimDetails({ claim: initialClaim, onBack, onEdit }) {
  const [claim, setClaim] = useState(initialClaim);
  const [showOriginalEmail, setShowOriginalEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // TPA State
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [tpaActionLoading, setTpaActionLoading] = useState(false);
  const [tpaMessage, setTpaMessage] = useState(null);
  const [tpaError, setTpaError] = useState(null);

  useEffect(() => {
    setClaim(initialClaim);
  }, [initialClaim]);

  // Load available TPA providers
  useEffect(() => {
    async function loadProviders() {
      try {
        const data = await fetchTPAProviders();
        setProviders(data);
        if (data.length > 0 && !selectedProviderId) {
          setSelectedProviderId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load TPA providers:', err);
      }
    }
    loadProviders();
  }, []);

  // Refresh TPA status for this claim
  const refreshTPAStatus = async () => {
    try {
      const statusData = await fetchTPAStatus(claim.id);
      setClaim(prev => ({
        ...prev,
        status: statusData.internal_status,
        tpa_reference_id: statusData.tpa_reference_id,
        tpa_status: statusData.tpa_status,
        tpa_pushed_at: statusData.tpa_pushed_at,
        tpa_last_updated: statusData.tpa_last_updated,
        tpa_provider: statusData.tpa_provider,
      }));
    } catch (err) {
      console.error('Failed to refresh TPA status:', err);
    }
  };

  const handleAssignTPA = async () => {
    if (!selectedProviderId) return;
    setTpaActionLoading(true);
    setTpaError(null);
    setTpaMessage(null);
    try {
      const res = await assignTPAToClaim(claim.id, selectedProviderId);
      setTpaMessage(`Assigned to ${res.provider}! Ref: ${res.tpa_reference_id}`);
      await refreshTPAStatus();
    } catch (err) {
      setTpaError(err.response?.data?.detail || 'Failed to assign claim to TPA.');
    } finally {
      setTpaActionLoading(false);
    }
  };

  const handleRetryPush = async () => {
    setTpaActionLoading(true);
    setTpaError(null);
    setTpaMessage(null);
    try {
      const res = await retryTPAPush(claim.id);
      setTpaMessage(`Claim pushed successfully! Ref: ${res.tpa_reference_id}`);
      await refreshTPAStatus();
    } catch (err) {
      setTpaError(err.response?.data?.detail || 'Failed to push claim to TPA.');
    } finally {
      setTpaActionLoading(false);
    }
  };

  const handleSimulateUpdate = async () => {
    setTpaActionLoading(true);
    setTpaError(null);
    setTpaMessage(null);
    try {
      const res = await simulateTPAUpdate(claim.id);
      setTpaMessage(`Simulated update received: status is now "${res.new_status}"`);
      await refreshTPAStatus();
    } catch (err) {
      setTpaError(err.response?.data?.detail || 'Failed to simulate status update.');
    } finally {
      setTpaActionLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateFNOL(claim.id, { extracted_fields: claim.extracted_fields });
      setSuccess('Changes saved.');
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

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

      {/* ─────────────────────────────────────────────
          TPA Management Card
      ───────────────────────────────────────────── */}
      <div className="claim-details-card tpa-management-card">
        <div className="tpa-card-header">
          <div>
            <h2 className="claim-details-card-heading" style={{ margin: 0 }}>Third Party Administrator (TPA)</h2>
            <p className="tpa-card-subheading">
              Manage external claim handoff, dispatch status, and synchronization.
            </p>
          </div>
          {claim.tpa_status && (
            <span className={`status-badge status-${claim.tpa_status.toLowerCase().replace(/\s+/g, '')}`}>
              TPA: {claim.tpa_status}
            </span>
          )}
        </div>

        <div className="tpa-info-grid">
          <div className="claim-details-field">
            <span className="claim-info-label">Assigned Provider</span>
            <span className="claim-info-value">
              {claim.tpa_provider?.name || (claim.tpa_reference_id ? 'Assigned' : 'Not assigned yet')}
              {claim.tpa_provider?.is_mock && <span className="tpa-mock-tag">Mock Mode</span>}
            </span>
          </div>

          <div className="claim-details-field">
            <span className="claim-info-label">TPA Reference ID</span>
            <span className="claim-info-value" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {claim.tpa_reference_id || '—'}
            </span>
          </div>

          <div className="claim-details-field">
            <span className="claim-info-label">Last Pushed</span>
            <span className="claim-info-value">
              {claim.tpa_pushed_at ? new Date(claim.tpa_pushed_at).toLocaleString() : '—'}
            </span>
          </div>

          <div className="claim-details-field">
            <span className="claim-info-label">TPA Last Updated</span>
            <span className="claim-info-value">
              {claim.tpa_last_updated ? new Date(claim.tpa_last_updated).toLocaleString() : '—'}
            </span>
          </div>
        </div>

        <div className="tpa-actions-bar">
          <div className="tpa-assign-group">
            <label htmlFor="tpa-select" className="tpa-assign-label">Assign TPA Partner:</label>
            <select
              id="tpa-select"
              className="tpa-select"
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              disabled={tpaActionLoading || providers.length === 0}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) {p.is_mock ? '• Mock' : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAssignTPA}
              disabled={tpaActionLoading || !selectedProviderId}
            >
              {tpaActionLoading ? 'Assigning...' : (claim.tpa_reference_id ? 'Reassign & Push' : 'Assign & Push')}
            </button>
          </div>

          <div className="tpa-quick-buttons">
            {claim.tpa_reference_id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleRetryPush}
                disabled={tpaActionLoading}
                title="Resend claim payload to TPA"
              >
                Re-Push Claim
              </button>
            )}

            {claim.tpa_reference_id && (
              <button
                type="button"
                className="btn btn-secondary tpa-simulate-btn"
                onClick={handleSimulateUpdate}
                disabled={tpaActionLoading}
                title="Simulate status advancement from TPA in mock mode"
              >
                Simulate Status Update
              </button>
            )}
          </div>
        </div>

        {tpaMessage && <p className="tpa-feedback-success" role="status">{tpaMessage}</p>}
        {tpaError && <p className="tpa-feedback-error" role="alert">{tpaError}</p>}
      </div>

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
        <AttachmentViewer attachments={claim.attachments} />
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
              <div className="claim-details-email-body" dangerouslySetInnerHTML={{ __html: claim.email_body || '—' }} />
            </div>
          </div>
        )}
      </div>
      {error && <p className="fnol-edit-error" role="alert">{error}</p>}
      {success && <p className="fnol-edit-success" role="status">{success}</p>}
      {onEdit && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ marginTop: '20px' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      )}
    </div>
  );
}
