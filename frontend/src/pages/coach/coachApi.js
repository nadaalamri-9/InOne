import { api, mediaUrl } from "../../services/api";
import { normalizeProjectFromApi } from "../student/projects/services/projectApi";

export const COACH_GENERAL_FEEDBACK_SECTION = "Overall project feedback";

export const COACH_FEEDBACK_SECTIONS = [
  "Project summary",
  "Problem",
  "Solution",
  "Architecture",
  "Role",
  "Results",
  "Features",
  "Tools",
  "Skills",
  "Team",
  "Screenshots",
  "Links & resume",
];

export function getDefaultCoachProfile() {
  return {
    name: "Career Coach",
    title: "Career Coach",
    email: "",
    phone: "",
    location: "",
    photoUrl: "",
    bio: "",
  };
}

export async function getCoachProfile() {
  try {
    const data = await api.get("/auth/me");
    return {
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Career Coach",
      title: "Career Coach",
      email: data.email || "",
      phone: "",
      location: "",
      photoUrl: "",
      bio: "",
    };
  } catch {
    return getDefaultCoachProfile();
  }
}

export async function saveCoachProfile() {
  // Profile editing for coach not yet exposed via a dedicated endpoint
  return getDefaultCoachProfile();
}

export async function getCoachDashboardData() {
  try {
    const data = await api.get("/coach/dashboard");
    return {
      stats: {
        projects: data.stats?.projects || 0,
        needsRevision: data.stats?.needs_revision || data.stats?.needsRevision || 0,
        feedback: data.stats?.feedback || 0,
        published: data.stats?.published || 0,
      },
      projects: (data.recent_projects || data.projects || []).map(normalizeProjectFromApi),
      feedback: (data.feedback || []).map(normalizeCoachFeedbackItem),
    };
  } catch {
    return { stats: { projects: 0, needsRevision: 0, feedback: 0, published: 0 }, projects: [], feedback: [] };
  }
}

export async function getCoachStudents() {
  try {
    let data = await api.get("/coach/students");

    if (!Array.isArray(data) || data.length === 0) {
      data = await api.get("/admin/users");
      data = (Array.isArray(data) ? data : []).filter(
        (u) => String(u.role || "").toLowerCase().includes("student")
      );
    }

    return (Array.isArray(data) ? data : []).map((s) => ({
      id: s.id,
      name: s.name || "",
      email: s.email || "",
      location: s.location || "",
      role: s.role || "Student",
      photoUrl: mediaUrl(s.photo_url || s.photoUrl || ""),
      projectsCount: s.projects_count ?? s.projectsCount ?? 0,
      readyCount: s.ready_count ?? s.readyCount ?? 0,
      publishedCount: s.published_count ?? s.publishedCount ?? 0,
      needsRevisionCount: s.needs_revision_count ?? s.needsRevisionCount ?? 0,
      feedbackCount: s.feedback_count ?? s.feedbackCount ?? 0,
      openFeedbackCount: s.open_feedback_count ?? s.openFeedbackCount ?? 0,
      lastUpdated: s.last_updated || s.lastUpdated || "",
    }));
  } catch {
    return [];
  }
}

function normalizeCoachProject(raw) {
  const project = normalizeProjectFromApi(raw);
  return {
    ...project,
    studentName: raw.student_name || raw.studentName || "",
    studentEmail: raw.student_email || raw.studentEmail || "",
    studentPhotoUrl: mediaUrl(raw.student_photo_url || raw.studentPhotoUrl || ""),
  };
}

function normalizeCoachFeedbackItem(item = {}) {
  return {
    id: item.id || `${item.project_id || item.projectId}-${item.created_at || item.createdAt || Date.now()}`,
    projectId: item.project_id ?? item.projectId ?? null,
    projectTitle: item.project_title || item.projectTitle || "Project",
    studentName: item.student_name || item.studentName || "Student",
    studentEmail: item.student_email || item.studentEmail || "",
    studentPhotoUrl: mediaUrl(item.student_photo_url || item.studentPhotoUrl || ""),
    status: item.status || "draft",
    message: item.message || item.feedback || item.comment || "",
    section: item.section || COACH_GENERAL_FEEDBACK_SECTION,
    coachName: item.coach_name || item.coachName || "Coach",
    coachPhotoUrl: mediaUrl(item.coach_photo_url || item.coachPhotoUrl || ""),
    isResolved: Boolean(item.is_resolved ?? item.isResolved ?? false),
    createdAt: item.created_at || item.createdAt || "",
  };
}

export async function getCoachProjects() {
  try {
    const data = await api.get("/coach/projects");
    return Array.isArray(data) ? data.map(normalizeCoachProject) : [];
  } catch {
    return [];
  }
}

export async function getCoachProjectById(projectId) {
  try {
    const data = await api.get(`/coach/projects/${projectId}`);
    return normalizeCoachProject(data);
  } catch {
    return null;
  }
}

export async function updateCoachProjectStatus(projectId, status) {
  const data = await api.patch(`/projects/${projectId}/status`, { status });
  return normalizeProjectFromApi(data);
}

export async function sendCoachFeedback(projectId, payload) {
  const data = await api.post(`/coach/projects/${projectId}/feedback`, {
    message: payload.message,
    section: payload.section || COACH_GENERAL_FEEDBACK_SECTION,
    status: payload.status || "needs_revision",
  });
  return data;
}

export async function getCoachFeedbackItems() {
  try {
    const data = await api.get("/coach/feedback");
    return (Array.isArray(data) ? data : [])
      .map(normalizeCoachFeedbackItem)
      .filter((item) => item.message)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch {
    try {
      const projects = await getCoachProjects();
      return projects
        .flatMap((project) =>
          (Array.isArray(project.reviewFeedback) ? project.reviewFeedback : []).map((item) => ({
            id: item.id || `${project.id}-${item.tempId}`,
            projectId: project.id,
            projectTitle: project.title,
            studentName: project.studentName || "Student",
            studentPhotoUrl: project.studentPhotoUrl || "",
            status: project.status,
            message: item.message || "",
            section: item.section || COACH_GENERAL_FEEDBACK_SECTION,
            coachName: item.coachName || "Coach",
            coachPhotoUrl: item.coachPhotoUrl || "",
            isResolved: Boolean(item.isResolved),
            createdAt: item.createdAt || project.updatedAt || "",
          }))
        )
        .filter((item) => item.message)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch {
      return [];
    }
  }
}


export function getEmployeeOfTheMonthForRole(role = "Career Coach") {
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
