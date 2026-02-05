import React from 'react';

function FNOLList({ workItems, onEdit }) {
  return (
    <div>
      <h2>FNOL Work Items</h2>
      {workItems.length === 0 ? (
        <p>No FNOL work items found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subject</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workItems.map((item, idx) => (
              <tr key={item.id || idx}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.email_subject}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.status || 'pending'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
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
