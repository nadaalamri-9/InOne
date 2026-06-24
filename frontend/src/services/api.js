/**
 * Central API client for InOne.
 * All fetch calls go through here so auth headers and base URL are consistent.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Origin that serves uploaded files (`/uploads/...`) — API_BASE without the `/api` suffix.
export const MEDIA_BASE = API_BASE.replace(/\/api\/?$/, "");

/**
 * Resolve a backend media path to an absolute URL.
 * Relative `/uploads/...` paths are prefixed with the backend origin so the
 * browser (running on a different port) loads them from the API, not itself.
 * Already-absolute URLs (http, data, blob) are returned unchanged.
 */
export function mediaUrl(path) {
  if (!path) return "";
  const str = String(path);
  if (/^(https?:|data:|blob:)/i.test(str)) return str;
  return `${MEDIA_BASE}${str.startsWith("/") ? "" : "/"}${str}`;
}

/** Strip the backend origin back off, so stored values stay relative. */
export function toRelativeMedia(url) {
  if (!url) return "";
  const str = String(url);
  return str.startsWith(MEDIA_BASE) ? str.slice(MEDIA_BASE.length) : str;
}

function getToken() {
  return localStorage.getItem("inoneToken") || "";
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isFormData = options.body instanceof FormData;

  const headers = authHeaders(isFormData ? {} : { "Content-Type": "application/json" });

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errorMsg;
    } catch {
      // ignore parse error
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (path) => apiFetch(path, { method: "GET" }),
  post: (path, data) =>
    apiFetch(path, { method: "POST", body: data instanceof FormData ? data : JSON.stringify(data) }),
  put: (path, data) =>
    apiFetch(path, { method: "PUT", body: data instanceof FormData ? data : JSON.stringify(data) }),
  patch: (path, data) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (path) => apiFetch(path, { method: "DELETE" }),
  upload: (path, formData) => apiFetch(path, { method: "POST", body: formData }),
};

// ── Auth helpers ─────────────────────────────────────────────────────────────

export function saveSession(token, user) {
  localStorage.setItem("inoneToken", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("inoneToken");
  localStorage.removeItem("currentUser");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken() && getStoredUser());
}


// Remove old mock/local-only data keys from earlier frontend versions.
// The real profile/projects now come from SQLite through the FastAPI backend.
export function cleanupLegacyLocalStorage() {
  [
    "mockProfile",
    "mockProjects",
    "studentProfile",
    "portfolioData",
    "projects",
    "inoneProfile",
    "inoneProjects",
  ].forEach((key) => localStorage.removeItem(key));
}
