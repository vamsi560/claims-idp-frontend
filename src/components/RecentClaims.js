import React from 'react';
import EmptyClaimsState from './EmptyClaimsState';
import './RecentClaims.css';

export default function RecentClaims({ claims, onView, sortBy, setSortBy, filter, setFilter }) {
  // Debug: Log claims data to the console whenever it changes
  React.useEffect(() => {
    console.log('Claims data for table:', claims);
  }, [claims]);
  const isEmpty = claims.length === 0;
  const isFilteredEmpty = filter.trim() !== '';

  return (
    <div className="recent-claims-container">
      <div className="recent-claims-toolbar">
        <label htmlFor="claims-search" className="recent-claims-search-label">
          Search
        </label>
        <input
          id="claims-search"
          type="search"
          className="recent-claims-search"
          placeholder="Search by ID, subject, or status..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Search claims by ID, subject, or status"
          autoComplete="off"
        />
        <label htmlFor="claims-sort" className="recent-claims-sort-label">
          Sort by
        </label>
        <select
          id="claims-sort"
          className="recent-claims-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort claims"
        >
          <option value="date">Date (newest first)</option>
          <option value="status">Status</option>
          <option value="id">Claim ID</option>
        </select>
      </div>

      {isEmpty ? (
        <EmptyClaimsState
          title={isFilteredEmpty ? 'No matching claims' : 'No claims yet'}
          message={isFilteredEmpty
            ? 'Try a different search or clear the filter.'
            : 'New claims will appear here when they\'re created.'}
        />
      ) : (
        <>
          <div className="recent-claims-table-wrapper">
            <table className="recent-claims-table" role="table" aria-label="Recent claims">
              <caption className="recent-claims-table-caption">List of claims</caption>
              <thead>
                <tr>
                  <th scope="col">Claim ID</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Date Received</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>#{claim.id}</td>
                    <td>{claim.email_subject}</td>
                    <td>{claim.created_at ? claim.created_at.split('T')[0] : '—'}</td>
                    <td>{claim.tag ? claim.tag : <span style={{color:'#aaa'}}>—</span>}</td>
                    <td>
                      <span className={`status-badge status-${(claim.status || 'new').toLowerCase().replace(/\s+/g, '')}`}>
                        {claim.status || 'New'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary view-btn"
                        onClick={() => onView(claim)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="recent-claims-cards" role="list" aria-label="Recent claims (card view)">
            {claims.map((claim) => (
              <article
                key={claim.id}
                className="claim-card"
                role="listitem"
              >
                <div className="claim-card-header">
                  <span className="claim-card-id">#{claim.id}</span>
                  <span className={`status-badge status-${(claim.status || 'new').toLowerCase().replace(/\s+/g, '')}`}>
                    {claim.status || 'New'}
                  </span>
                </div>
                <h2 className="claim-card-subject">{claim.email_subject}</h2>
                <p className="claim-card-date">
                  {claim.created_at ? claim.created_at.split('T')[0] : '—'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary claim-card-view"
                  onClick={() => onView(claim)}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
