import React, { useState } from 'react';
import { updateFNOL } from '../api';

function FNOLEdit({ workItem, onBack }) {
  const [fields, setFields] = useState(workItem.extracted_fields || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateFNOL(workItem.id, { extracted_fields: fields });
      setSuccess('Changes saved.');
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateFNOL(workItem.id, { extracted_fields: fields, status: 'submitted' });
      setSuccess('FNOL submitted.');
    } catch (err) {
      setError('Failed to submit FNOL.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Edit FNOL</h3>
      <div>
        <strong>Subject:</strong> {workItem.email_subject}
      </div>
      <div>
        <strong>Status:</strong> {workItem.status || 'pending'}
      </div>
      <div>
        <strong>Email Body:</strong>
        <pre style={{ background: '#f8f8f8', padding: '8px' }}>{workItem.email_body}</pre>
      </div>
      <h4>Extracted Fields</h4>
      {Object.keys(fields).length === 0 ? (
        <p>No extracted fields.</p>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <label>
                {key}: <input name={key} value={value} onChange={handleChange} />
              </label>
            </div>
          ))}
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button onClick={onBack} style={{ marginTop: '16px', marginRight: '8px' }}>Back</button>
      <button onClick={handleSave} disabled={saving} style={{ marginTop: '16px', marginRight: '8px' }}>Save</button>
      <button onClick={handleSubmit} disabled={saving} style={{ marginTop: '16px' }}>Submit</button>
    </div>
  );
}

export default FNOLEdit;
