import { api, mediaUrl } from "../../services/api";

export function getDefaultEmployerProfile() {
  return {
    name: "Employer",
    title: "Hiring Team",
    email: "employer@example.com",
    phone: "",
    city: "Riyadh, Saudi Arabia",
    location: "Riyadh, Saudi Arabia",
    photoUrl: "",
  };
}

export async function getEmployerProfile() {
  try {
    const data = await api.get("/auth/me");
    return {
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Employer",
      title: "Hiring Team",
      email: data.email || "",
      phone: "",
      location: "Riyadh, Saudi Arabia",
      photoUrl: "",
    };
  } catch {
    return getDefaultEmployerProfile();
  }
}

function normalizeCandidate(c) {
  return {
    id: c.id,
    fullName: c.full_name || c.fullName || "",
    role: c.role || "",
    headline: c.headline || "",
    location: c.location || "",
    email: c.email || "",
    photoUrl: mediaUrl(c.photo_url || c.photoUrl || ""),
    skills: c.skills || [],
    targetRoles: c.target_roles || c.targetRoles || [],
    projects: c.projects || [],
    project_count: c.project_count || 0,
    featuredProject: c.featured_project || c.featuredProject || null,
    portfolioUrl: c.portfolio_url || c.portfolioUrl || "",
    status: c.status || "Public",
    savedAt: c.saved_at || c.savedAt || "",
  };
}

export async function getEmployerDashboardData() {
  try {
    const data = await api.get("/employer/dashboard");
    const raw = data.stats || {};
    return {
      stats: {
        totalStudents: raw.total_students ?? raw.totalStudents ?? 0,
        savedPortfolios: raw.saved_portfolios ?? raw.savedPortfolios ?? 0,
        publishedProjects: raw.published_projects ?? raw.publishedProjects ?? 0,
      },
      candidates: (data.candidates || []).map(normalizeCandidate),
      savedIds: data.saved_ids || data.savedIds || [],
    };
  } catch {
    return { stats: { totalStudents: 0, savedPortfolios: 0, publishedProjects: 0 }, candidates: [], savedIds: [] };
  }
}

export async function getEmployerCandidates() {
  try {
    const data = await api.get("/employer/candidates");
    return (Array.isArray(data) ? data : []).map(normalizeCandidate);
  } catch {
    return [];
  }
}

export async function getEmployerSaved() {
  try {
    const data = await api.get("/employer/saved");
    return (Array.isArray(data) ? data : []).map(normalizeCandidate);
  } catch {
    return [];
  }
}

export async function savePortfolio(studentId) {
  return api.post(`/employer/saved/${studentId}`, {});
}

export async function unsavePortfolio(studentId) {
  return api.delete(`/employer/saved/${studentId}`);
}

export function getEmployeeOfTheMonthForRole(role = "Employer") {
  try {
    const employee = JSON.parse(
      localStorage.getItem("inone_employee_of_the_month") || "null"
    );

    if (!employee) return null;

    const employeeRole = String(employee.role || "").toLowerCase();
    const targetRole = String(role || "").toLowerCase();

    if (employeeRole !== targetRole) return null;

    return { ...employee, avatar: mediaUrl(employee.avatar || employee.photoUrl || employee.photo_url || "") };
  } catch {
    return null;
  }
}
