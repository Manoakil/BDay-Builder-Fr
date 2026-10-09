import { API_BASE_URL, getAuthHeaders } from './authService';

export const getPlatformMetrics = async () => {
  const res = await fetch(`${API_BASE_URL}/analytics/platform-metrics`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch platform metrics");
  }
  return res.json();
};

export const getOrgMetrics = async (orgId) => {
  const res = await fetch(`${API_BASE_URL}/analytics/org-metrics/${orgId}`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch org metrics");
  }
  return res.json();
};

export const getMyOrganizations = async () => {
  const res = await fetch(`${API_BASE_URL}/organizations/`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch organizations");
  }
  return res.json();
};

export const createOrganization = async (orgData) => {
  const res = await fetch(`${API_BASE_URL}/organizations/`, {
    method: "POST", headers: getAuthHeaders(true), body: JSON.stringify(orgData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create organization");
  }
  return res.json();
};

export const deleteOrganization = async (orgId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
    method: "DELETE", headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to delete organization");
  return true;
};

export const regenerateOrgCode = async (orgId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/regenerate-code`, {
    method: "POST", headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to regenerate code");
  return res.json();
};

export const getPendingOrgAdmins = async () => {
  const res = await fetch(`${API_BASE_URL}/organizations/pending-org-admins`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to fetch pending org admins");
  return res.json();
};

export const getGlobalMembers = async () => {
  const res = await fetch(`${API_BASE_URL}/organizations/global-members`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to fetch global members");
  return res.json();
};

export const getOrganizationMembers = async (orgId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/members`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to fetch organization members");
  return res.json();
};

export const approveMember = async (orgId, userId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${userId}/approve`, {
    method: "POST",
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to approve member");
  return res.json();
};

export const rejectMember = async (orgId, userId, reason = "") => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${userId}/reject`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ rejection_reason: reason })
  });
  if (!res.ok) throw new Error("Failed to reject member");
  return res.json();
};

export const removeMember = async (orgId, userId) => {
  const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to remove member");
  return true;
};

export const getGlobalAuditLogs = async () => {
  const res = await fetch(`${API_BASE_URL}/audit-logs/`, {
    headers: getAuthHeaders(true)
  });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
};
