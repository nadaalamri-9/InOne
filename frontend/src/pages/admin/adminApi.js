import { api, mediaUrl } from "../../services/api";

const EMPLOYEE_OF_THE_MONTH_KEY = "inone_employee_of_the_month";

export function getDefaultAdminProfile() {
  return {
    name: "Admin",
    title: "Platform Manager",
    email: "admin@example.com",
    phone: "",
    city: "Riyadh, Saudi Arabia",
    location: "Riyadh, Saudi Arabia",
    photoUrl: "",
  };
}

export async function getAdminProfile() {
  try {
    const data = await api.get("/auth/me");
    return {
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Admin",
      title: "Platform Manager",
      email: data.email || "",
      phone: "",
      location: "Riyadh, Saudi Arabia",
      photoUrl: "",
    };
  } catch {
    return getDefaultAdminProfile();
  }
}

function normalizeAdminUser(user = {}) {
  const firstName = user.first_name || user.firstName || "";
  const lastName = user.last_name || user.lastName || "";
  const name = user.name || user.full_name || `${firstName} ${lastName}`.trim() || "User";
  const photo = user.photo_url || user.photoUrl || user.avatar || "";

  return {
    ...user,
    name,
    first_name: firstName,
    last_name: lastName,
    role: user.role || "student",
    status: user.status || (user.is_active === false ? "Inactive" : "Active"),
    city: user.city || user.location || "",
    location: user.location || user.city || "",
    phone: user.phone || "",
    title: user.title || user.headline || "",
    photo_url: photo,
    photoUrl: mediaUrl(photo),
    avatar: mediaUrl(photo),
  };
}

export async function getAdminDashboardData() {
  try {
    const data = await api.get("/admin/dashboard/analytics");
    return {
      ...data,
      users: Array.isArray(data.users) ? data.users.map(normalizeAdminUser) : [],
    };
  } catch {
    return {
      stats: {
        students: 0,
        coaches: 0,
        employers: 0,
        admins: 0,
        portfolios: 0,
        total_users: 0,
      },
      role_counts: { students: 0, coaches: 0, employers: 0, admins: 0 },
      users: [],
      projects: [],
    };
  }
}

export async function getAdminUsers() {
  try {
    const data = await api.get("/admin/users");
    return Array.isArray(data) ? data.map(normalizeAdminUser) : [];
  } catch {
    return [];
  }
}

export async function getAdminUser(userId) {
  return normalizeAdminUser(await api.get(`/admin/users/${userId}`));
}

export async function updateUserRole(userId, role) {
  return api.patch(`/admin/users/${userId}/role`, { role });
}

export async function updateAdminUser(userId, payload) {
  return api.patch(`/admin/users/${userId}`, payload);
}

export async function deleteUser(userId) {
  return api.delete(`/admin/users/${userId}`);
}

export async function getAdminPortfolios() {
  try {
    const data = await api.get("/admin/portfolios");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getAdminProjects() {
  return getAdminPortfolios();
}

// ── Legacy helpers (kept for compatibility) ───────────────────────────────────

export function saveAdminUsers() {}

export function getStoredEmployeeOfTheMonth() {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_OF_THE_MONTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveEmployeeOfTheMonth(employee) {
  if (!employee) {
    localStorage.removeItem(EMPLOYEE_OF_THE_MONTH_KEY);
    return null;
  }

  localStorage.setItem(EMPLOYEE_OF_THE_MONTH_KEY, JSON.stringify(employee));
  return employee;
}

export function getEmployeeCandidates() {
  return [];
}

export function makeAdminUser(payload = {}) {
  return { id: payload.id || `user-${Date.now()}`, ...payload };
}

export function getAdminStudentUsers(users = []) {
  return (users || []).filter((u) => u.role === "student" || u.role === "Student");
}

export async function addAdminUser() {
  return null;
}

export async function buildDefaultUsers() {
  return [];
}
