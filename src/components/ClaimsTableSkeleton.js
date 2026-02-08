import React from 'react';
import './ClaimsTableSkeleton.css';

export default function ClaimsTableSkeleton() {
  return (
    <div className="claims-skeleton-container" aria-busy="true" aria-label="Loading claims">
      <div className="claims-skeleton-toolbar">
        <div className="claims-skeleton-search" />
        <div className="claims-skeleton-sort" />
      </div>
      <table className="claims-skeleton-table" role="presentation">
        <thead>
          <tr>
            <th scope="col">Claim ID</th>
            <th scope="col">Subject</th>
            <th scope="col">Date Received</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td><span className="skeleton-line skeleton-id" /></td>
              <td><span className="skeleton-line skeleton-subject" /></td>
              <td><span className="skeleton-line skeleton-date" /></td>
              <td><span className="skeleton-line skeleton-badge" /></td>
              <td><span className="skeleton-line skeleton-btn" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
