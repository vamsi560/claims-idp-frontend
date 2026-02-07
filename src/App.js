

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

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <FNOLDashboard
          claims={deduplicateWorkItems(workItems)}
          selectedClaim={selectedClaim || deduplicateWorkItems(workItems)[0]}
          onSelectClaim={setSelectedClaim}
        />
      )}
    </>
  );
}

export default App;
