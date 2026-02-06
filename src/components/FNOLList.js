import React from 'react';

function FNOLList({ workItems, onEdit }) {
  return (
    <div className="card">
      <h2>FNOL Work Items</h2>
      {workItems.length === 0 ? (
        <p>No FNOL work items found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item, idx) => (
              <tr key={item.id || idx}>
                <td>{item.id}</td>
                <td>{item.email_subject}</td>
                <td>{item.status || 'pending'}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FNOLList;
