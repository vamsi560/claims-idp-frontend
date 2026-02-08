  // Deduplicate claims by message_id (or other unique field)
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


import React, { useEffect, useState } from 'react';
import RecentClaims from './components/RecentClaims';
import ClaimDetails from './components/ClaimDetails';
import Login from './components/Login';
import { fetchFNOLs } from './api';
import './App.css';


function App() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  // Sorting/filtering state (must be at top level)
  const [sortBy, setSortBy] = useState('date');
  const [filter, setFilter] = useState('');

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

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Show all FNOL work items
  const allClaims = deduplicateWorkItems(workItems);

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
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 0' }}>
          <RecentClaims
            claims={filteredClaims}
            onView={setSelectedClaim}
          />
        </div>
      </div>
    );
  }

  // Show extracted fields page when a claim is selected
  return (
    <div className="fnol-dashboard dark-blue-bg">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 0' }}>
        <ClaimDetails
          claim={selectedClaim}
          onBack={() => setSelectedClaim(null)}
        />
      </div>
    </div>
  );
  // (Remove duplicate/invalid return block)
}

export default App;
