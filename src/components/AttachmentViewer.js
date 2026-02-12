
import React from 'react';

function deduplicateAttachments(attachments) {
  if (!Array.isArray(attachments)) return [];
  const seen = new Set();
  return attachments.filter(att => {
    // Prefer id, fallback to filename
    const key = att && att.id ? att.id : att && att.filename ? att.filename : JSON.stringify(att);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function AttachmentViewer({ attachments }) {
  const uniqueAttachments = deduplicateAttachments(attachments);
    console.log('AttachmentViewer attachments:', attachments);
  return (
    <div>
      <h4>Attachments</h4>
      {uniqueAttachments.length === 0 ? (
        <div>No attachments</div>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {uniqueAttachments.map((att, idx) =>
            typeof att === 'object' && att.id && att.filename && att.blob_url ? (
              <li key={att.id} style={{ marginBottom: 8 }}>
                <a href={att.blob_url} target="_blank" rel="noopener noreferrer">{att.filename}</a>
                {att.doc_type ? ` (${att.doc_type})` : ''}
              </li>
            ) : (
              <li key={idx}>{JSON.stringify(att)}</li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default AttachmentViewer;
