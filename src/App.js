import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import RecentClaims from './components/RecentClaims';
import ClaimDetails from './components/ClaimDetails';
import FNOLEdit from './components/FNOLEdit';
import Login from './components/Login';
import ClaimsTableSkeleton from './components/ClaimsTableSkeleton';
import { fetchFNOLs } from './api';
import './App.css';

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

function App() {
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filter, setFilter] = useState('');

  const loadFNOLs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFNOLs();
      setWorkItems(data);
    } catch (err) {
      setError('Failed to load claims. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    loadFNOLs();
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const allClaims = deduplicateWorkItems(workItems);
  const recentClaimsForSidebar = [...allClaims]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 10);

  const search = filter.toLowerCase().trim();
  let filteredClaims = allClaims.filter(claim =>
    claim.id.toString().includes(search) ||
    (claim.email_subject && claim.email_subject.toLowerCase().includes(search)) ||
    (claim.status && claim.status.toLowerCase().includes(search))
  );
  if (sortBy === 'date') {
    filteredClaims = [...filteredClaims].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  } else if (sortBy === 'status') {
    filteredClaims = [...filteredClaims].sort((a, b) => (a.status || '').localeCompare(b.status || ''));
  } else if (sortBy === 'id') {
    filteredClaims = [...filteredClaims].sort((a, b) => a.id - b.id);
  }

  const handleBackFromDetails = () => {
    setSelectedClaim(null);
    setEditMode(false);
  };

  const handleSaveSuccess = (updated) => {
    setSelectedClaim(prev => prev && prev.id === updated.id ? { ...prev, ...updated } : prev);
  };

  const getPageTitle = () => {
    if (editMode && selectedClaim) return 'Edit claim';
    if (selectedClaim) return `Claim #${selectedClaim.id}`;
    return 'Recent Claims';
  };

  const mainContent = () => {
    if (loading) {
      return <ClaimsTableSkeleton />;
    }
    if (error) {
      return (
        <div className="app-error-state" role="alert">
          <p className="app-error-message">{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadFNOLs}>Try again</button>
        </div>
      );
    }
    if (!selectedClaim) {
      return (
        <RecentClaims
          claims={filteredClaims}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filter={filter}
          setFilter={setFilter}
          onView={setSelectedClaim}
        />
      );
    }
    if (editMode) {
      return (
        <FNOLEdit
          workItem={selectedClaim}
          onBack={() => setEditMode(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      );
    }
    return (
      <ClaimDetails
        claim={selectedClaim}
        onBack={handleBackFromDetails}
        onEdit={() => setEditMode(true)}
      />
    );
  };

  return (
    <AppShell
      pageTitle={getPageTitle()}
      recentClaims={recentClaimsForSidebar}
      selectedClaim={selectedClaim}
      onSelectClaim={(claim) => {
        setSelectedClaim(claim);
        setEditMode(false);
      }}
      onGoToClaims={handleBackFromDetails}
      onSignOut={() => setLoggedIn(false)}
    >
      {mainContent()}
    </AppShell>
  );
}

export default App;
