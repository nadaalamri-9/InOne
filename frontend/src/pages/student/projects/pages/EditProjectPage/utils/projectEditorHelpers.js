export function getProjectStatusLabel(status) {
  const value = String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const labels = {
    draft: "Draft",
    in_progress: "In progress",
    needs_revision: "Needs revision",
    ready: "Ready",
    published: "Published",
  };

  return labels[value] || "Draft";
}

export function getProjectStatusClass(status) {
  const value = String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const classes = {
    draft: "project-status-draft",
    in_progress: "project-status-progress",
    needs_revision: "project-status-revision",
    ready: "project-status-ready",
    published: "project-status-published",
  };

  return classes[value] || "project-status-draft";
}

export function formatProjectSavedAt(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getProjectSavedLabel(status) {
  const value = String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (value === "draft") return "Draft saved";
  if (value === "needs_revision") return "Needs revision";
  if (value === "ready") return "Ready";
  if (value === "published") return "Published";

  return "Last saved";
}
