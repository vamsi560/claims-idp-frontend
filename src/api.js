
export async function fetchClaimsSummary() {
  const res = await axios.get(`${API_BASE}/analytics/claims-summary`);
  return res.data;
}

export async function fetchClaimsTrend(days = 30) {
  const res = await axios.get(`${API_BASE}/analytics/claims-trend?days=${days}`);
  return res.data;
}
import axios from 'axios';

const API_BASE = 'https://claims-idp-backend-bbe0f4hkckhdcubv.centralus-01.azurewebsites.net';

export async function fetchFNOLs() {
  const res = await axios.get(`${API_BASE}/fnol/`);
  return res.data;
}

export async function submitFNOL(data) {
  const res = await axios.post(`${API_BASE}/fnol/`, data);
  return res.data;
}

export async function uploadAttachment(workitemId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('workitem_id', workitemId);
  const res = await axios.post(`${API_BASE}/attachments/`, formData);
  return res.data;
}

export async function updateFNOL(id, data) {
  const res = await axios.put(`${API_BASE}/fnol/${id}/`, data);
  return res.data;
}
