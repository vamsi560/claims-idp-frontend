

import React, { useEffect, useState } from 'react';
import FNOLDashboard from './components/FNOLDashboard';
import Login from './components/Login';
import { fetchFNOLs } from './api';
import './App.css';

function App() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    async function loadFNOLs() {
      try {
        const data = await fetchFNOLs();
        setWorkItems(data);
      } catch (err) {
        setError('Failed to load FNOL work items');
      } finally {
        setLoading(false);
      }
    }
    loadFNOLs();
  }, [loggedIn]);

  function deduplicateWorkItems(items) {
    const seen = new Set();
    return items.filter(item => {
      if (item.message_id) {
        if (seen.has(item.message_id)) return false;
        seen.add(item.message_id);
      }
      return true;
    });
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Show all FNOL work items
  const allClaims = deduplicateWorkItems(workItems);

  // Sorting/filtering state
  const [sortBy, setSortBy] = useState('date');
  const [filter, setFilter] = useState('');

  // Sort and filter claims
  let filteredClaims = allClaims.filter(claim => {
    const search = filter.toLowerCase();
    return (
      claim.id.toString().includes(search) ||
      (claim.email_subject && claim.email_subject.toLowerCase().includes(search)) ||
      (claim.status && claim.status.toLowerCase().includes(search))
    );
  });
  if (sortBy === 'date') {
    filteredClaims = filteredClaims.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === 'status') {
    filteredClaims = filteredClaims.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
  } else if (sortBy === 'priority') {
    filteredClaims = filteredClaims.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  if (!selectedClaim) {
    return (
      <div className="fnol-dashboard dark-blue-bg">
        <aside className="fnol-sidebar dark-blue-bg">
          <h2 className="gold-text">Recent Claims</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Search by ID, subject, status"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ flex: 1, borderRadius: '8px', padding: '8px', border: '1px solid #bfa14a' }}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ borderRadius: '8px', padding: '8px', border: '1px solid #bfa14a' }}>
              <option value="date">Date</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <ul className="fnol-claim-list">
            {filteredClaims.length === 0 ? (
              <div className="fnol-skeleton" style={{ width: '100%', height: '32px' }} />
            ) : (
              filteredClaims.map(claim => (
                <li
                  key={claim.id}
                  className={selectedClaim && claim.id === selectedClaim.id ? 'selected' : ''}
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div>
                    <div className="claim-title gold-text">Claim #{claim.id}: {claim.email_subject}</div>
                    <div style={{ fontSize: '0.95rem', color: '#fff' }}>{claim.claim_type || ''}</div>
                  </div>
                  <div className={`claim-status ${claim.status ? claim.status.toLowerCase() : ''}`}>{claim.status || 'Status'}</div>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>
    );
  }

  // Show extracted fields page when a claim is selected
  return (
    <FNOLDashboard
      claims={allClaims}
      selectedClaim={selectedClaim}
      onSelectClaim={setSelectedClaim}
      showProfileDropdown={true}
    />
  );
}

export default App;
