
import React, { useState, useEffect } from 'react';
import { fetchClaimsSummary, fetchClaimsTrend } from '../api';
import {
  Bar,
  Pie,
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);
import './FNOLDashboard.css';

const tabs = ['Analytics', 'Summary', 'Email Source', 'Extracted Data', 'Attachments'];

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
  const [activeTab, setActiveTab] = useState('Analytics');
  // Safe default for onSelectClaim
  const handleSelectClaim = onSelectClaim && typeof onSelectClaim === 'function' ? onSelectClaim : () => {};
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [summaryData, trendData] = await Promise.all([
          fetchClaimsSummary(),
          fetchClaimsTrend(30)
        ]);
        setSummary(summaryData);
        setTrend(trendData);
      } catch (e) {
        setSummary(null);
        setTrend([]);
      }
      setLoading(false);
    }
    if (activeTab === 'Analytics') loadAnalytics();
  }, [activeTab]);

  // Prepare chart data
  const statusLabels = summary ? Object.keys(summary.claims_by_status || {}) : [];
  const statusCounts = summary ? Object.values(summary.claims_by_status || {}) : [];
  const typeLabels = summary ? Object.keys(summary.claims_by_type || {}) : [];
  const typeCounts = summary ? Object.values(summary.claims_by_type || {}) : [];
  const trendLabels = trend.map(t => t.date);
  const trendCounts = trend.map(t => t.count);

  return (
    <div className="fnol-dashboard white-bg">
      <header className="fnol-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/images/ValueMomentum_logo.png" alt="ValueMomentum Logo" style={{ width: 100, height: 40, marginLeft: '10px' }} />
          <span style={{ fontWeight: 700, fontSize: 24, color: '#222' }}>Claims Workbench</span>
        </div>
        <div className="fnol-title teal-text">{activeTab === 'Analytics' ? 'Claims Analytics' : `Claim Details - #${selectedClaim ? selectedClaim.id : ''}`}</div>
        <div className="fnol-profile">
          <div className="fnol-profile-icon" />
          <div className="fnol-profile-name">Joan profile</div>
        </div>
      </header>
      <main className="fnol-main white-bg">
        <div className="fnol-tabs">
            {tabs.map(tab => (
              <div
                key={tab}
                className={`fnol-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{ color: activeTab === tab ? '#009688' : '#183a5a', borderBottom: activeTab === tab ? '2px solid #009688' : '2px solid transparent' }}
              >{tab}</div>
            ))}
          </div>
        {activeTab === 'Analytics' && (
          <div style={{ margin: '24px 0' }}>
            {loading ? <div>Loading analytics...</div> : summary && (
              <>
                <div style={{ display: 'flex', gap: '32px', marginBottom: 32 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>Claims by Status</div>
                    <Pie
                      data={{
                        labels: statusLabels,
                        datasets: [{
                          data: statusCounts,
                          backgroundColor: ['#009688', '#4dd0e1', '#80cbc4', '#e0e0e0', '#b2dfdb', '#26a69a'],
                        }]
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>Claims by Type</div>
                    <Bar
                      data={{
                        labels: typeLabels,
                        datasets: [{
                          label: 'Count',
                          data: typeCounts,
                          backgroundColor: '#009688',
                        }]
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        scales: { x: { ticks: { color: '#009688' } }, y: { beginAtZero: true } }
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>Avg. Processing Time</div>
                    <div style={{ fontSize: 32, color: '#009688', fontWeight: 700 }}>
                      {Math.round((summary.average_processing_time_seconds || 0) / 3600 * 10) / 10} hrs
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Claims Trend (Last 30 Days)</div>
                  <Line
                    data={{
                      labels: trendLabels,
                      datasets: [{
                        label: 'Claims',
                        data: trendCounts,
                        borderColor: '#009688',
                        backgroundColor: 'rgba(0,150,136,0.15)',
                        tension: 0.3
                      }]
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { ticks: { color: '#009688' } }, y: { beginAtZero: true } }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'Extracted Data' && selectedClaim && (
          <>
            {renderExtractedFields(selectedClaim.extracted_fields)}
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
              <button className="fnol-view-email-btn teal-btn">Save</button>
              <button className="fnol-view-email-btn teal-btn">Submit</button>
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
