import { api, mediaUrl } from "../../../../services/api";

export const viewerContext = {
  role: "employer",
  hasPrivateToken: true,
};

function toArray(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") return item;
    return item?.name || item?.title || item?.label || "";
  }).filter(Boolean);
}

function normalizeProfile(data = {}) {
  const socialLinks = data.socialLinks || data.social_links || {};
  const firstName = data.firstName ?? data.first_name ?? "";
  const lastName = data.lastName ?? data.last_name ?? "";
  const fullName = data.fullName || data.full_name || `${firstName} ${lastName}`.trim();
  const skills = toArray(data.skills);
  const targetRoles = toArray(data.targetRoles ?? data.target_roles);
  const resumeName = data.resumeName || data.resume_name || "";
  const resumeUrl = mediaUrl(data.resumeUrl || data.resume_url || "");

  return {
    privacy: { visibility: data.visibility || "private", allowedViewers: ["owner", "coach", "employer"] },
    student: {
      firstName, lastName, fullName,
      title: data.role || data.track || "",
      headline: data.title || data.headline || "",
      track: data.track || "",
      location: data.location || "",
      email: data.email || "",
      phone: data.phone || "",
      avatarInitials: getInitials(firstName, lastName),
      photoUrl: mediaUrl(data.photoPreview || data.photoUrl || data.photo_url || ""),
      aboutMe: data.aboutMe || data.about_me || "",
      bio: data.bio || "",
      about: data.aboutMe || data.about_me || "",
    },
    socialLinks: {
      linkedin: socialLinks.linkedin || "",
      github: socialLinks.github || "",
      website: socialLinks.website || socialLinks.portfolio || data.website || "",
    },
    targetRoles,
    skills,
    education: normalizeEducation(data.education),
    certifications: normalizeCertifications(data.certifications),
    resume: {
      fileName: resumeName,
      updatedAt: resumeUrl || resumeName ? "Saved in your profile" : "",
      url: resumeUrl,
    },
  };
}

function normalizeEducation(items) {
  if (!Array.isArray(items) || !items.length) return [];
  return items.map((item) => ({
    school: item.school || item.university || "",
    degree: item.degree || "",
    date: item.year || item.date || "",
    details: item.details || item.description || "",
  })).filter((item) => item.school || item.degree || item.date || item.details);
}

function normalizeCertifications(items) {
  if (!Array.isArray(items) || !items.length) return [];
  return items.map((item) => {
    if (typeof item === "string") {
      const parts = item.split(/\s+[·-]\s+/);
      return { name: parts[0] || item, year: parts.slice(1).join(" ") };
    }
    return { name: item.name || item.title || item.label || "", year: item.year || item.date || "" };
  }).filter((item) => item.name || item.year);
}

function getInitials(firstName, lastName) {
  const first = String(firstName || "").trim()[0] || "";
  const last = String(lastName || "").trim()[0] || "";
  return `${first}${last}`.toUpperCase();
}

function normalizeStatus(status) {
  const text = String(status || "draft").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (text === "needs_revision" || text === "revision") return "Needs Revision";
  if (text === "published") return "Published";
  if (text === "ready" || text === "approved") return "Ready";
  return "Draft";
}

function getProjectImage(project = {}) {
  const screenshot = Array.isArray(project.screenshots) ? project.screenshots[0] : null;
  if (typeof screenshot === "string") return screenshot;
  if (screenshot && typeof screenshot === "object") {
    return mediaUrl(screenshot.preview || screenshot.url || "");
  }
  return mediaUrl(project.imageUrl || project.image_url || project.coverImage || "");
}

function normalizeTeamMembers(items) {
  if (!Array.isArray(items)) return [];
  return items.map((member) => ({
    id: member.id ?? null,
    userId: member.userId ?? member.user_id ?? null,
    name: member.name ?? member.fullName ?? member.full_name ?? "",
    email: member.email ?? "",
    photoUrl: mediaUrl(member.photoUrl ?? member.photo_url ?? member.photoPreview ?? ""),
    role: member.role ?? "Student",
  }));
}

function normalizeProject(project = {}) {
  const skills = toArray(project.skills).length ? toArray(project.skills) : toArray(project.tools || project.tech_stack);
  return {
    id: project.id || project.title,
    title: project.title || "Untitled project",
    status: normalizeStatus(project.status),
    type: (project.isSoloProject ?? project.is_solo_project) ? "Solo project" : "Team project",
    date: project.duration || project.updatedAt || project.updated_at || "",
    summary: project.summary || project.overview || project.description || "",
    skills,
    imageUrl: getProjectImage(project),
    githubUrl: project.githubUrl || project.github_url || "",
    demoUrl: project.demoUrl || project.demo_url || project.link || "",
    teamMembers: normalizeTeamMembers(project.teamMembers ?? project.team_members ?? []),
    feedback: normalizeFeedback(project.reviewFeedback || project.review_feedback || project.feedback || []),
  };
}

function normalizeFeedback(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") return { message: item };
    return {
      project: item.project || item.projectTitle || item.project_title || "",
      message: item.message || item.feedback || item.comment || "",
      date: item.date || item.createdAt || item.created_at || "",
    };
  }).filter((item) => item.message);
}

export function buildPortfolioData({ profile = {}, projects = [] } = {}) {
  const baseProfile = normalizeProfile(profile);
  const normalizedProjects = (Array.isArray(projects) ? projects : [])
    .map(normalizeProject)
    .filter((project) => project.status === "Published");

  const feedbackFromProjects = normalizedProjects.flatMap((project) =>
    project.feedback.map((item) => ({ ...item, project: item.project || project.title }))
  );

  return { ...baseProfile, projects: normalizedProjects, feedback: feedbackFromProjects };
}

export async function loadPortfolioDataFromApi() {
  try {
    const data = await api.get("/portfolio/me");
    return buildPortfolioData({ profile: data.profile || {}, projects: data.projects || [] });
  } catch {
    return buildPortfolioData({});
  }
}

export function loadPortfolioData() {
  return buildPortfolioData({});
}

export const portfolioData = buildPortfolioData({});
