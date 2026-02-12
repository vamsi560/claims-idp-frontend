import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const [sortBy, setSortBy] = useState('date');
  const [filter, setFilter] = useState('');


  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    navigate('/home');
  };


  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

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

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/home" element={
        loggedIn ? (
          <AppShell
            pageTitle="Recent Claims"
            recentClaims={recentClaimsForSidebar}
            selectedClaim={null}
            onSelectClaim={(claim) => navigate(`/claims/${claim.id}`)}
            onGoToClaims={() => navigate('/home')}
            onSignOut={handleLogout}
          >
            {loading ? <ClaimsTableSkeleton /> : error ? (
              <div className="app-error-state" role="alert">
                <p className="app-error-message">{error}</p>
                <button type="button" className="btn btn-primary" onClick={loadFNOLs}>Try again</button>
              </div>
            ) : (
              <RecentClaims
                claims={filteredClaims}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filter={filter}
                setFilter={setFilter}
                onView={(claim) => navigate(`/claims/${claim.id}`)}
              />
            )}
          </AppShell>
        ) : <Navigate to="/" />
      } />
      <Route path="/claims/:id" element={<ClaimDetailsRoute allClaims={allClaims} recentClaims={recentClaimsForSidebar} loggedIn={loggedIn} onSignOut={handleLogout} />} />
      <Route path="/claims/:id/edit" element={<ClaimEditRoute allClaims={allClaims} recentClaims={recentClaimsForSidebar} loggedIn={loggedIn} onSignOut={handleLogout} />} />
    </Routes>
  );
}

function ClaimDetailsRoute({ allClaims, recentClaims, loggedIn, onSignOut }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = allClaims.find(c => c.id === parseInt(id));

  if (!loggedIn) return <Navigate to="/login" />;
  if (allClaims.length === 0) return <ClaimsTableSkeleton />;
  if (!claim) return <Navigate to="/" />;

  return (
    <AppShell
      pageTitle={`Claim #${claim.id}`}
      recentClaims={recentClaims}
      selectedClaim={claim}
      onSelectClaim={(c) => navigate(`/claims/${c.id}`)}
      onGoToClaims={() => navigate('/')}
      onSignOut={onSignOut}
    >
      <ClaimDetails
        claim={claim}
        onBack={() => navigate('/')}
        onEdit={() => navigate(`/claims/${claim.id}/edit`)}
      />
    </AppShell>
  );
}

function ClaimEditRoute({ allClaims, recentClaims, loggedIn, onSignOut }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const claim = allClaims.find(c => c.id === parseInt(id));

  if (!loggedIn) return <Navigate to="/login" />;
  if (allClaims.length === 0) return <ClaimsTableSkeleton />;
  if (!claim) return <Navigate to="/" />;

  return (
    <AppShell
      pageTitle="Edit claim"
      recentClaims={recentClaims}
      selectedClaim={claim}
      onSelectClaim={(c) => navigate(`/claims/${c.id}`)}
      onGoToClaims={() => navigate('/')}
      onSignOut={onSignOut}
    >
      <FNOLEdit
        workItem={claim}
        onBack={() => navigate(`/claims/${claim.id}`)}
        onSaveSuccess={() => navigate(`/claims/${claim.id}`)}
      />
    </AppShell>
  );
}

export default App;
