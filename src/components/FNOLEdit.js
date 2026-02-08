import React, { useState } from 'react';
import { updateFNOL } from '../api';
import './FNOLEdit.css';

const FIELD_SECTIONS = {
  Summary: ['summary'],
  'Intent & claim type': ['intent', 'reported_by_and_main_contact_are_same', 'claim_type'],
  Contact: ['reporting_contact', 'best_contact', 'reply_to_emails'],
  'Insured & claimants': ['insured', 'claimants', 'claimants_count', 'injured_person_contact', 'plaintiff'],
  Policy: ['policy'],
  Loss: ['loss'],
  'Acknowledgment & legal': ['acknowledgment', 'matter', 'lawsuit_or_complaint_received'],
};

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function setNested(obj, path, value) {
  const keys = path.split('.');
  if (keys.length === 1) return { ...obj, [keys[0]]: value };
  const [first, ...rest] = keys;
  return {
    ...obj,
    [first]: setNested(obj[first] || {}, rest.join('.'), value),
  };
}

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

  const updateField = (path, value) => {
    setFields((prev) => setNested(prev, path, value));
  };

  const renderValue = (path, value) => {
    if (value == null) {
      return (
        <input
          type="text"
          className="fnol-edit-input"
          value=""
          onChange={(e) => updateField(path, e.target.value)}
          placeholder="—"
        />
      );
    }
    if (typeof value === 'boolean') {
      return (
        <select
          className="fnol-edit-input"
          value={value ? 'true' : 'false'}
          onChange={(e) => updateField(path, e.target.value === 'true')}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }
    if (Array.isArray(value)) {
      if (value.length === 0 || typeof value[0] !== 'object') {
        return (
          <input
            type="text"
            className="fnol-edit-input"
            value={value.join(', ')}
            onChange={(e) => updateField(path, e.target.value.split(',').map((s) => s.trim()))}
          />
        );
      }
      return (
        <div className="fnol-edit-array">
          {value.map((item, idx) => (
            <div key={idx} className="fnol-edit-group">
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="fnol-edit-field">
                  <label className="fnol-edit-label">{formatLabel(k)}</label>
                  {typeof v === 'object' && v !== null ? (
                    <div className="fnol-edit-group-inner">
                      {Object.entries(v).map(([k2, v2]) => (
                        <div key={k2} className="fnol-edit-field">
                          <label className="fnol-edit-label">{formatLabel(k2)}</label>
                          <input
                            type="text"
                            className="fnol-edit-input"
                            value={v2 == null ? '' : String(v2)}
                            onChange={(e) => {
                              const newItem = { ...item, [k]: { ...(item[k] || {}), [k2]: e.target.value } };
                              const newArr = [...value];
                              newArr[idx] = newItem;
                              updateField(path, newArr);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="fnol-edit-input"
                      value={v == null ? '' : String(v)}
                      onChange={(e) => {
                        const newItem = { ...item, [k]: e.target.value };
                        const newArr = [...value];
                        newArr[idx] = newItem;
                        updateField(path, newArr);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === 'object') {
      return (
        <div className="fnol-edit-group">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="fnol-edit-field">
              <label className="fnol-edit-label">{formatLabel(k)}</label>
              {typeof v === 'object' && v !== null && !Array.isArray(v) ? (
                <div className="fnol-edit-group-inner">
                  {Object.entries(v).map(([k2, v2]) => (
                    <div key={k2} className="fnol-edit-field">
                      <label className="fnol-edit-label">{formatLabel(k2)}</label>
                      <input
                        type="text"
                        className="fnol-edit-input"
                        value={v2 == null ? '' : String(v2)}
                        onChange={(e) => updateField(`${path}.${k}.${k2}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="fnol-edit-input"
                  value={v == null ? '' : String(v)}
                  onChange={(e) => updateField(`${path}.${k}`, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <input
        type="text"
        className="fnol-edit-input"
        value={String(value)}
        onChange={(e) => updateField(path, e.target.value)}
      />
    );
  };

  const allKeys = new Set(Object.keys(fields));
  const sectioned = {};
  Object.entries(FIELD_SECTIONS).forEach(([sectionName, keys]) => {
    sectioned[sectionName] = keys.filter((k) => fields.hasOwnProperty(k));
    sectioned[sectionName].forEach((k) => allKeys.delete(k));
  });
  const otherKeys = Array.from(allKeys);

  return (
    <div className="fnol-edit">
      <div className="fnol-edit-meta">
        <p className="fnol-edit-meta-row"><strong>Subject</strong> {workItem.email_subject}</p>
        <p className="fnol-edit-meta-row"><strong>Status</strong> {workItem.status || 'pending'}</p>
      </div>

      <div className="fnol-edit-sections">
        {Object.entries(sectioned).map(([sectionName, keys]) =>
          keys.length === 0 ? null : (
            <section key={sectionName} className="fnol-edit-section">
              <h3 className="fnol-edit-section-title">{sectionName}</h3>
              <div className="fnol-edit-fields">
                {keys.map((key) => (
                  <div key={key} className="fnol-edit-field fnol-edit-field--top">
                    <label className="fnol-edit-label">{formatLabel(key)}</label>
                    <div className="fnol-edit-value">{renderValue(key, fields[key])}</div>
                  </div>
                ))}
              </div>
            </section>
          )
        )}
        {otherKeys.length > 0 && (
          <section className="fnol-edit-section">
            <h3 className="fnol-edit-section-title">Other</h3>
            <div className="fnol-edit-fields">
              {otherKeys.map((key) => (
                <div key={key} className="fnol-edit-field fnol-edit-field--top">
                  <label className="fnol-edit-label">{formatLabel(key)}</label>
                  <div className="fnol-edit-value">{renderValue(key, fields[key])}</div>
                </div>
              ))}
            </div>
          </section>
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
