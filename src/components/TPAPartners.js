import React, { useEffect, useState } from 'react';
import { fetchTPAProviders } from '../api';
import './TPAPartners.css';

export default function TPAPartners() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTPAProviders();
        setProviders(data);
      } catch (err) {
        console.error('Failed to load TPA providers:', err);
        setError('Failed to fetch TPA partners. Please verify backend connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="tpa-partners-container">
      <div className="tpa-partners-header">
        <div>
          <h1 className="tpa-partners-title">Third Party Administrators (TPAs)</h1>
          <p className="tpa-partners-desc">
            Partner organizations handling external FNOL claims processing and servicing.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="tpa-partners-loading">Loading TPA partners...</div>
      ) : error ? (
        <div className="app-error-state" role="alert">
          <p className="app-error-message">{error}</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="tpa-partners-empty">No TPA partners configured.</div>
      ) : (
        <div className="tpa-partners-grid">
          {providers.map((p) => (
            <div key={p.id} className="tpa-partner-card">
              <div className="tpa-partner-card-header">
                <div>
                  <h2 className="tpa-partner-name">{p.name}</h2>
                  <span className="tpa-partner-code">{p.code}</span>
                </div>
                <div className="tpa-badge-group">
                  {p.is_mock && <span className="tpa-tag-mock">Mock Mode</span>}
                  <span className={`tpa-tag-active ${p.is_active ? 'active' : 'inactive'}`}>
                    {p.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="tpa-partner-details">
                <div className="tpa-partner-detail-item">
                  <span className="tpa-detail-label">Specialties</span>
                  <span className="tpa-detail-value">{p.specialties || 'General Claims'}</span>
                </div>

                <div className="tpa-partner-detail-item">
                  <span className="tpa-detail-label">Contact Email</span>
                  <span className="tpa-detail-value">{p.contact_email || '—'}</span>
                </div>

                <div className="tpa-partner-detail-item">
                  <span className="tpa-detail-label">Phone</span>
                  <span className="tpa-detail-value">{p.contact_phone || '—'}</span>
                </div>

                <div className="tpa-partner-detail-item">
                  <span className="tpa-detail-label">Claims Assigned</span>
                  <span className="tpa-detail-value tpa-claim-count">{p.claim_count ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
