import axios from "axios";

const API_BASE = "https://claims-idp-byhphxaphvexd4ak.eastus-01.azurewebsites.net";

export async function fetchClaimsSummary() {
  const res = await axios.get(`${API_BASE}/analytics/claims-summary`);
  return res.data;
}

export async function fetchClaimsTrend(days = 30) {
  const res = await axios.get(
    `${API_BASE}/analytics/claims-trend?days=${days}`,
  );
  return res.data;
}

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
  formData.append("file", file);
  formData.append("workitem_id", workitemId);
  const res = await axios.post(`${API_BASE}/attachments/`, formData);
  return res.data;
}

export async function updateFNOL(id, data) {
  const res = await axios.put(`${API_BASE}/fnol/${id}/`, data);
  return res.data;
}

// ─────────────────────────────────────────────
// TPA API Integration
// ─────────────────────────────────────────────

export async function fetchTPAProviders() {
  const res = await axios.get(`${API_BASE}/tpa/providers/`);
  return res.data;
}

export async function fetchTPAProvider(providerId) {
  const res = await axios.get(`${API_BASE}/tpa/providers/${providerId}/`);
  return res.data;
}

export async function assignTPAToClaim(fnolId, providerId) {
  const res = await axios.post(`${API_BASE}/tpa/assign/${fnolId}/?provider_id=${providerId}`);
  return res.data;
}

export async function retryTPAPush(fnolId) {
  const res = await axios.post(`${API_BASE}/tpa/retry/${fnolId}/`);
  return res.data;
}

export async function simulateTPAUpdate(fnolId) {
  const res = await axios.post(`${API_BASE}/tpa/simulate-update/${fnolId}/`);
  return res.data;
}

export async function fetchTPAStatus(fnolId) {
  const res = await axios.get(`${API_BASE}/tpa/status/${fnolId}/`);
  return res.data;
}
