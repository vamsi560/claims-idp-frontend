import React, { useState } from 'react';
import { updateFNOL } from '../api';

function FNOLEdit({ workItem, onBack, onSaveSuccess }) {
  const [fields, setFields] = useState(workItem.extracted_fields || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateFNOL(workItem.id, { extracted_fields: fields });
      setSuccess('Changes saved.');
      if (onSaveSuccess) onSaveSuccess({ id: workItem.id, extracted_fields: fields });
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
      if (onSaveSuccess) onSaveSuccess({ id: workItem.id, extracted_fields: fields, status: 'submitted' });
    } catch (err) {
      setError('Failed to submit FNOL.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to render nested fields dynamically
  const renderFields = (obj, parentKey = '') => {
    if (obj == null) return <span>—</span>;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>—</span>;
      // Render array of objects or primitives
      if (typeof obj[0] === 'object') {
        return (
          <div style={{ marginBottom: '12px' }}>
            {obj.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #e0e0e0' }}>
                {renderFields(item, parentKey)}
              </div>
            ))}
          </div>
        );
      } else {
        return <span>{obj.join(', ')}</span>;
      }
    }
    if (typeof obj === 'object') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: 12 }}>
          {Object.entries(obj).map(([key, value]) => (
            <React.Fragment key={parentKey + key}>
              <label htmlFor={parentKey + key}>{key.replace(/_/g, ' ')}</label>
              {typeof value === 'object' && value !== null ? (
                <div style={{ padding: 0 }}>{renderFields(value, parentKey + key + '.')}</div>
              ) : (
                <input
                  id={parentKey + key}
                  name={parentKey + key}
                  value={value == null ? '' : value}
                  onChange={e => {
                    // Deep update for nested fields
                    const update = (o, k, v) => {
                      if (k.length === 1) return { ...o, [k[0]]: v };
                      return { ...o, [k[0]]: update(o[k[0]] || {}, k.slice(1), v) };
                    };
                    setFields(f => update(f, (parentKey + key).split('.'), e.target.value));
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    // Primitive
    return <input value={obj} readOnly />;
  };

  return (
    <div className="card">
      <h3>Edit FNOL</h3>
      <div style={{ marginBottom: '12px' }}>
        <strong>Subject:</strong> {workItem.email_subject}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <strong>Status:</strong> {workItem.status || 'pending'}
      </div>
      <div style={{ marginBottom: '18px' }}>
        <strong>Email Body:</strong>
        <pre>{workItem.email_body}</pre>
      </div>
      <h4>Extracted Fields</h4>
      <div className="extracted-fields">
        {Object.keys(fields).length === 0 ? (
          <p>No extracted fields.</p>
        ) : (
          <form onSubmit={e => e.preventDefault()}>
            {renderFields(fields)}
          </form>
        )}
      </div>
      {error && <p className="fnol-edit-error" role="alert">{error}</p>}
      {success && <p className="fnol-edit-success" role="status">{success}</p>}
      <div className="fnol-edit-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>Back</button>
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default FNOLEdit;
