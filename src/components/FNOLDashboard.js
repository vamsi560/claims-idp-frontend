

import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, Tooltip, Legend);
import './FNOLDashboard.css';

import { fetchClaimsSummary, fetchClaimsTrend } from '../api';

export default function FNOLDashboard() {
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
    loadAnalytics();
  }, []);

  // Prepare chart data
  const statusLabels = summary ? Object.keys(summary.claims_by_status || {}) : [];
  const statusCounts = summary ? Object.values(summary.claims_by_status || {}) : [];
  // statusColors: [pending, complete, ...] - pending: light orange, complete: green
  const statusColors = ['#ffb300', '#43a047', '#4caf50', '#e53935'];
  const statusPercentages = summary && summary.claims_by_status ? Object.values(summary.claims_by_status).map(
    (count, i, arr) => arr.reduce((a, b) => a + b, 0) ? Math.round((count / arr.reduce((a, b) => a + b, 0)) * 100) : 0
  ) : [];
  const trendLabels = trend.map((t, i) => `Day ${i + 1}`);
  const trendCounts = trend.map(t => t.count);

  return (
    <div className="dashboard-root">
      {/* Main dashboard content only, header/nav/titles removed as requested */}
      <main className="dashboard-main">
        {/* Top summary cards */}
        <div className="dashboard-cards-row">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              {/* Document Icon for Total Claims */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="3" width="14" height="18" rx="2" fill="#20406a" />
                <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff" />
                <rect x="7" y="11" width="10" height="2" rx="1" fill="#fff" />
                <rect x="7" y="15" width="6" height="2" rx="1" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="dashboard-card-label">Total Claims</div>
              <div className="dashboard-card-value">{
                summary && summary.claims_by_status
                  ? Object.values(summary.claims_by_status).reduce((a, b) => Number(a) + Number(b), 0)
                  : '--'
              }</div>
            </div>
          </div>
          {/* Removed New Claims card */}
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              {/* Pending/Clock Icon for In Progress (light orange) */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#ffb300" />
                <path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="dashboard-card-label">In Progress</div>
              <div className="dashboard-card-value">{
                summary && summary.claims_by_status && typeof summary.claims_by_status.pending !== 'undefined'
                  ? Number(summary.claims_by_status.pending)
                  : '--'
              }</div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              {/* Completed Icon (green) */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#43a047" />
                <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="dashboard-card-label">Completed</div>
              <div className="dashboard-card-value">{
                summary && summary.claims_by_status && typeof summary.claims_by_status.complete !== 'undefined'
                  ? Number(summary.claims_by_status.complete)
                  : '--'
              }</div>
            </div>
          </div>
        </div>
        {/* Charts row */}
        <div className="dashboard-charts-row">
          <div className="dashboard-card chart-card">
            <div className="dashboard-card-label">Claims by Status</div>
            <Pie
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusCounts,
                  backgroundColor: statusColors,
                }]
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: '#20406a',
                      font: { size: 14 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percent = statusPercentages[context.dataIndex] || 0;
                        return `${label} (${percent}%)`;
                      }
                    }
                  }
                },
                cutout: '70%',
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={220}
            />
          </div>
          <div className="dashboard-card chart-card">
            <div className="dashboard-card-label">Claims Trend (Last 30 Days)</div>
            <Line
              data={{
                labels: trendLabels,
                datasets: [{
                  label: 'Claims',
                  data: trendCounts,
                  borderColor: '#20406a',
                  backgroundColor: 'rgba(32,64,106,0.08)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 0
                }]
              }}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    ticks: { color: '#20406a', font: { size: 12 } },
                    grid: { display: false }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { color: '#20406a', font: { size: 12 } },
                    grid: { color: '#e0e0e0' }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={220}
            />
          </div>
        </div>
        {/* Recent Activity removed */}
      </main>
    </div>
  );
}
