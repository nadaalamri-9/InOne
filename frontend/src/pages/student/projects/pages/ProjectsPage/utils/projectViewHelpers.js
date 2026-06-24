import GitHubIcon from "../../../../../../assets/GitHub.svg";
import WebSiteIcon from "../../../../../../assets/WebSite.svg";

export function getNormalizedProjectStatus(status) {
  return String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function getProjectStatusLabel(status) {
  const labels = {
    draft: "Draft",
    in_progress: "In Progress",
    needs_revision: "Needs Revision",
    ready: "Ready",
    published: "Published",
  };

  return labels[getNormalizedProjectStatus(status)] || "Draft";
}

export function getProjectStatusClass(status) {
  const classes = {
    draft: "projects-status-draft",
    in_progress: "projects-status-progress",
    needs_revision: "projects-status-revision",
    ready: "projects-status-ready",
    published: "projects-status-published",
  };

  return classes[getNormalizedProjectStatus(status)] || "projects-status-draft";
}

export function getProjectTimestamp(project) {
  const date = new Date(project?.updatedAt || project?.createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function formatProjectSavedAt(value) {
  if (!value) return "Not saved yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getProjectSavedLabel(project) {
  const status = getNormalizedProjectStatus(project?.status);

  if (status === "draft") return "Draft saved";
  if (status === "needs_revision") return "Needs revision";
  if (status === "ready") return "Ready";
  if (status === "published") return "Published";

  return "Updated";
}

function normalizeTagItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);
}

export function getProjectTagGroups(project) {
  const tools = [...new Set(normalizeTagItems(project.tools))].slice(0, 2);
  const skills = [...new Set(normalizeTagItems(project.skills))].slice(0, 2);

  return { tools, skills };
}

export function getFirstScreenshot(project) {
  const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
  const firstScreenshot = screenshots[0];

  if (!firstScreenshot) return "";

  return firstScreenshot.preview || firstScreenshot.url || firstScreenshot.dataUrl || "";
}

export function getTeamMembers(project) {
  return Array.isArray(project.teamMembers) ? project.teamMembers : [];
}

export function getTemplateSections(project) {
  const features = Array.isArray(project.features) ? project.features : [];

  return [
    { key: "Problem", ready: Boolean(String(project.businessProblem || "").trim()) },
    { key: "Solution", ready: Boolean(String(project.solution || "").trim()) },
    { key: "Role", ready: Boolean(String(project.role || "").trim()) },
    { key: "Features", ready: features.length > 0 },
  ];
}

export function getProjectLinkItems(project) {
  return [
    {
      key: "GitHub",
      ready: Boolean(String(project.githubUrl || project.github_url || "").trim()),
      icon: GitHubIcon,
    },
    {
      key: "Demo",
      ready: Boolean(String(project.demoUrl || project.demo_url || "").trim()),
      icon: WebSiteIcon,
    },
  ];
}
