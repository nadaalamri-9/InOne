import { api, mediaUrl } from "../../../../services/api";

export function makeProjectTempId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function createEmptyProject() {
  return {
    id: null,
    userId: null,
    title: "",
    summary: "",
    duration: "",
    overview: "",
    businessProblem: "",
    solution: "",
    architecture: "",
    role: "",
    results: "",
    features: [],
    tools: [],
    skills: [],
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
    teamMembers: [],
    isSoloProject: true,
    reviewFeedback: [],
    status: "draft",
    updatedAt: "",
  };
}

function normalizeProjectStatus(status) {
  const text = String(status || "draft").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (["in_progress", "progress"].includes(text)) return "in_progress";
  if (["needs_revision", "need_revision", "revision", "needs_revisions"].includes(text)) return "needs_revision";
  if (["ready", "approved", "reviewed"].includes(text)) return "ready";
  if (["published", "publish"].includes(text)) return "published";
  return "draft";
}

function normalizeNamedList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") return { id: null, tempId: makeProjectTempId(), name: item };
    return { id: item.id ?? null, tempId: item.tempId ?? makeProjectTempId(), name: item.name ?? "" };
  });
}

function normalizeScreenshots(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const url = mediaUrl(item.url ?? item.screenshot_url ?? "");
    return {
      id: item.id ?? null,
      tempId: item.tempId ?? makeProjectTempId(),
      name: item.name ?? item.file_name ?? "Screenshot",
      url,
      preview: mediaUrl(item.preview ?? "") || url,
      file: null,
      type: item.type ?? "image",
      size: item.size ?? item.size_bytes ?? null,
    };
  });
}

function normalizeReviewFeedback(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") {
        return { id: null, tempId: makeProjectTempId(), message: item, createdAt: "", coachName: "Coach", coachCareer: "Coach", coachPhotoUrl: "", projectId: null, projectTitle: "", section: "", isResolved: false };
      }
      return {
        id: item.id ?? null,
        tempId: item.tempId ?? makeProjectTempId(),
        message: item.message ?? item.feedback ?? item.comment ?? "",
        createdAt: item.createdAt ?? item.created_at ?? "",
        coachName: item.coachName ?? item.coach_name ?? "Coach",
        coachCareer: item.coachCareer ?? item.coach_career ?? "Coach",
        coachPhotoUrl: mediaUrl(item.coachPhotoUrl ?? item.coach_photo_url ?? ""),
        projectId: item.projectId ?? item.project_id ?? null,
        projectTitle: item.projectTitle ?? item.project_title ?? "",
        section: item.section ?? "",
        isResolved: Boolean(item.isResolved ?? item.is_resolved ?? false),
      };
    })
    .filter((item) => String(item.message || "").trim());
}

function normalizeTeamMembers(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id ?? null,
    tempId: item.tempId ?? makeProjectTempId(),
    userId: item.userId ?? item.user_id ?? null,
    name: item.name ?? item.fullName ?? item.full_name ?? "",
    email: item.email ?? "",
    photoUrl: mediaUrl(item.photoUrl ?? item.photo_url ?? ""),
    role: item.role ?? "Student",
  }));
}

export function normalizeProjectFromApi(data = {}) {
  const emptyProject = createEmptyProject();
  const normalizedTeamMembers = normalizeTeamMembers(data.teamMembers ?? data.team_members ?? []);

  return {
    ...emptyProject,
    id: data.id ?? null,
    userId: data.userId ?? data.user_id ?? data.owner_id ?? null,
    title: data.title ?? "",
    summary: data.summary ?? "",
    duration: data.duration ?? "",
    overview: data.overview ?? data.description ?? "",
    businessProblem: data.businessProblem ?? data.business_problem ?? "",
    solution: data.solution ?? "",
    architecture: data.architecture ?? "",
    role: data.role ?? "",
    results: data.results ?? "",
    features: normalizeNamedList(data.features ?? []),
    tools: normalizeNamedList(data.tools ?? data.tech_stack ?? []),
    skills: normalizeNamedList(data.skills ?? []),
    githubUrl: data.githubUrl ?? data.github_url ?? "",
    demoUrl: data.demoUrl ?? data.demo_url ?? "",
    screenshots: normalizeScreenshots(data.screenshots ?? []),
    teamMembers: normalizedTeamMembers,
    isSoloProject: data.isSoloProject ?? data.is_solo_project ?? (normalizedTeamMembers.length === 0),
    reviewFeedback: normalizeReviewFeedback(
      data.reviewFeedback ?? data.review_feedback ?? data.feedback ?? []
    ),
    status: normalizeProjectStatus(data.status),
    updatedAt: data.updatedAt ?? data.updated_at ?? "",
    isFeatured: Boolean(data.isFeatured ?? data.is_featured ?? false),
  };
}

export function projectToApiPayload(project) {
  return {
    title: project.title,
    summary: project.summary,
    duration: project.duration,
    overview: project.overview,
    business_problem: project.businessProblem,
    solution: project.solution,
    architecture: project.architecture,
    role: project.role,
    results: project.results,
    features: project.features.map((f) => ({ id: f.id, name: f.name })),
    tools: project.tools.map((t) => ({ id: t.id, name: t.name })),
    skills: project.skills.map((s) => ({ id: s.id, name: s.name })),
    github_url: project.githubUrl,
    demo_url: project.demoUrl,
    is_solo_project: Boolean(project.isSoloProject),
    team_members: project.isSoloProject
      ? []
      : project.teamMembers
          .filter((m) => m.userId)
          .map((m) => ({ user_id: m.userId })),
    status: normalizeProjectStatus(project.status),
    visibility: project.visibility || "public",
  };
}

export async function getMyProjects() {
  const data = await api.get("/projects/me");
  const projects = Array.isArray(data) ? data : data.projects ?? [];
  return projects.map((p) => normalizeProjectFromApi(p));
}

export async function getProjectById(projectId) {
  const data = await api.get(`/projects/${projectId}`);
  return normalizeProjectFromApi(data);
}

export async function saveMyProject(project) {
  const projectId = project.id;
  const data = projectId
    ? await api.put(`/projects/${projectId}`, projectToApiPayload(project))
    : await api.post("/projects", projectToApiPayload(project));
  return normalizeProjectFromApi(data);
}

export async function deleteMyProject(projectId) {
  await api.delete(`/projects/${projectId}`);
  return { id: projectId };
}

export async function updateProjectStatus(projectId, status) {
  const data = await api.patch(`/projects/${projectId}/status`, { status });
  return normalizeProjectFromApi(data);
}

export async function publishProject(projectId) {
  const data = await api.patch(`/projects/${projectId}/publish`, {});
  return normalizeProjectFromApi(data);
}

export async function uploadProjectScreenshot(projectId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.upload(`/projects/${projectId}/screenshots`, formData);
}

export async function deleteProjectScreenshot(projectId, screenshotId) {
  return api.delete(`/projects/${projectId}/screenshots/${screenshotId}`);
}

export async function getMyProject() {
  const projects = await getMyProjects();
  return projects[0] ? normalizeProjectFromApi(projects[0]) : createEmptyProject();
}
