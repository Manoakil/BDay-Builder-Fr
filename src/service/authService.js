export const API_BASE_URL = "http://localhost:8000/api/v1";
const AUTH_URL = `${API_BASE_URL}/auth`;

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

export const getAuthHeaders = (isJson = true) => {
  const token = localStorage.getItem("access_token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");

  const payload = decodeToken(data.access_token);
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", payload.role || "wisher");

  // Fetch true user profile from /me
  let realFullName = email.split("@")[0] || "";
  try {
    const meRes = await fetch(`${AUTH_URL}/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      if (meData.full_name) {
        realFullName = meData.full_name;
      }
    }
  } catch (e) {
    console.error("Failed to fetch /me profile during login", e);
  }

  // Store user info
  const user = {
    id: payload.sub || "",
    full_name: realFullName,
    email: email,
    role: payload.role || "wisher",
  };
  localStorage.setItem("user", JSON.stringify(user));

  return data;
};

export const registerUser = async (email, password, full_name) => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
};

export const registerWithCode = async (email, password, full_name, secret_code, role, date_of_birth) => {
  const res = await fetch(`${AUTH_URL}/register-with-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email, 
      password, 
      full_name, 
      secret_code, 
      role, 
      date_of_birth: date_of_birth ? new Date(date_of_birth).toISOString().split('T')[0] : null 
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((issue) => issue.msg).join(" ")
      : data.detail;
    throw new Error(detail || "Secret code registration failed");
  }
  return data;
};

export const getRole = () => localStorage.getItem("role");

export const getRoleHome = () => {
  const role = getRole();
  const map = {
    "super-admin": "/super-admin",
    "super_admin": "/super-admin",
    "superadmin": "/super-admin",
    "org-admin": "/admin",
    "org_admin": "/admin",
    admin: "/admin",
    "bday-person": "/birthday/event",
    "bday_person": "/birthday/event",
    birthday_person: "/birthday/event",
    wisher: "/wisher",
  };
  return map[role] || "/wisher";
};