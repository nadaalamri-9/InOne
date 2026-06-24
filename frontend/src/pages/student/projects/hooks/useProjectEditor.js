import { useEffect, useRef, useState } from "react";
import {
  createEmptyProject,
  deleteProjectScreenshot,
  getProjectById,
  normalizeProjectFromApi,
  saveMyProject,
  uploadProjectScreenshot,
} from "../services/projectApi";

function isTextEmpty(value) {
  return !String(value || "").trim();
}

function isValidUrl(value) {
  const text = String(value || "").trim();

  if (!text) return true;

  const urlText = /^https?:\/\//i.test(text) ? text : `https://${text}`;

  try {
    const url = new URL(urlText);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function makeSafeProject(project) {
  return {
    ...createEmptyProject(),
    ...project,
    features: Array.isArray(project?.features) ? project.features : [],
    tools: Array.isArray(project?.tools) ? project.tools : [],
    skills: Array.isArray(project?.skills) ? project.skills : [],
    screenshots: Array.isArray(project?.screenshots) ? project.screenshots : [],
    teamMembers: Array.isArray(project?.teamMembers) ? project.teamMembers : [],
    reviewFeedback: Array.isArray(project?.reviewFeedback) ? project.reviewFeedback : [],
    isSoloProject:
      project?.isSoloProject ??
      project?.is_solo_project ??
      (!Array.isArray(project?.teamMembers) || project.teamMembers.length === 0),
  };
}

function cleanNamedList(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      ...item,
      name: String(item.name || "").trim(),
    }))
    .filter((item) => !isTextEmpty(item.name));
}

function cleanTeamMembers(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((member) => ({
      ...member,
      userId: member.userId ?? member.user_id ?? member.memberUserId ?? null,
      name: String(member.name || "").trim(),
      email: String(member.email || "").trim().toLowerCase(),
      photoUrl: member.photoUrl ?? member.photo_url ?? "",
      role: member.role || "Student",
    }))
    .filter((member) => member.userId);
}

function validateTeamMembers(teamMembers) {
  const memberErrors = {};
  const usedUserIds = new Set();

  teamMembers.forEach((member, index) => {
    if (!member.userId) {
      memberErrors[index] = "Select a valid student";
      return;
    }

    if (usedUserIds.has(member.userId)) {
      memberErrors[index] = "Member already added";
      return;
    }

    usedUserIds.add(member.userId);
  });

  return memberErrors;
}

function cleanProjectBeforeSave(project, status) {
  const cleanedTeamMembers = cleanTeamMembers(project.teamMembers);
  const isSoloProject = Boolean(project.isSoloProject) || cleanedTeamMembers.length === 0;

  return {
    ...project,

    title: String(project.title || "").trim(),
    summary: String(project.summary || "").trim(),
    duration: String(project.duration || "").trim(),
    overview: String(project.overview || "").trim(),

    businessProblem: String(project.businessProblem || "").trim(),
    solution: String(project.solution || "").trim(),
    architecture: String(project.architecture || "").trim(),

    role: String(project.role || "").trim(),
    results: String(project.results || "").trim(),

    githubUrl: String(project.githubUrl || "").trim(),
    demoUrl: String(project.demoUrl || "").trim(),

    features: cleanNamedList(project.features),
    tools: cleanNamedList(project.tools),
    skills: cleanNamedList(project.skills),

    screenshots: Array.isArray(project.screenshots) ? project.screenshots : [],
    isSoloProject,
    teamMembers: isSoloProject ? [] : cleanedTeamMembers,
    reviewFeedback: Array.isArray(project.reviewFeedback) ? project.reviewFeedback : [],

    status,
  };
}

function validateProject(project, mode) {
  const errors = {};

  if (!isValidUrl(project.githubUrl)) {
    errors.githubUrl = "e.g., https://github.com/username/project-name";
  }

  if (!isValidUrl(project.demoUrl)) {
    errors.demoUrl = "e.g., https://project-demo.com";
  }

  if (!project.isSoloProject) {
    const teamMemberErrors = validateTeamMembers(project.teamMembers);

    if (Object.keys(teamMemberErrors).length) {
      errors.teamMembers = teamMemberErrors;
    }
  }

  if (["publish", "submit_review"].includes(mode)) {
    if (isTextEmpty(project.title)) {
      errors.title = "Required.";
    }

    if (isTextEmpty(project.summary)) {
      errors.summary = "Required.";
    }


    if (isTextEmpty(project.businessProblem)) {
      errors.businessProblem = "Required.";
    }

    if (isTextEmpty(project.solution)) {
      errors.solution = "Required.";
    }

    if (isTextEmpty(project.role)) {
      errors.role = "Required.";
    }

    if (!project.tools.length) {
      errors.tools = "Required.";
    }
  }

  return errors;
}

export function useProjectEditor(project, setProject, options = {}) {
  const {
    initialEditing = false,
    onSaved,
    keepEditingAfterDraft = false,
  } = options;
  const [draftProject, setDraftProject] = useState(createEmptyProject());
  const [isEditing, setIsEditing] = useState(Boolean(initialEditing));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [projectBeforeEdit, setProjectBeforeEdit] = useState(null);
  const editingProjectKeyRef = useRef(null);

  useEffect(() => {
    const snapshot = makeSafeProject(project);
    const projectKey = snapshot.id ? String(snapshot.id) : "new-project";

    if (!isEditing) {
      setDraftProject(snapshot);
      editingProjectKeyRef.current = projectKey;
      return;
    }

    // When the edit page loads an existing project asynchronously,
    // refresh the editable draft once the real project data arrives.
    if (initialEditing && editingProjectKeyRef.current !== projectKey) {
      setDraftProject(snapshot);
      setProjectBeforeEdit(snapshot);
      editingProjectKeyRef.current = projectKey;
    }
  }, [project, isEditing, initialEditing]);

  const safeProject = makeSafeProject(draftProject);

  const notify = (type, text) => {
    setToast({
      id: Date.now(),
      type,
      text,
    });
  };

  const startEditing = () => {
    const snapshot = makeSafeProject(project);
    const normalizedStatus = String(snapshot.status || "draft")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

    if (normalizedStatus === "published") {
      notify("info", "Published projects cannot be edited");
      return;
    }

    setProjectBeforeEdit(snapshot);
    setDraftProject(snapshot);
    setErrors({});
    setIsEditing(true);

    notify("info", "Editing");
  };

  const cancelEditing = () => {
    const snapshot = makeSafeProject(projectBeforeEdit || project);

    setDraftProject(snapshot);
    setProject(snapshot);
    setProjectBeforeEdit(null);
    setErrors({});
    setIsEditing(false);

    notify("info", "Cancelled");
  };

  const updateProject = (field, value) => {
    if (!isEditing) return;

    setDraftProject((prev) => ({
      ...createEmptyProject(),
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const saveProject = async (mode) => {
    try {
      setSaving(true);

      const status =
        mode === "publish"
          ? "published"
          : mode === "submit_review"
            ? "needs_revision"
            : "draft";
      const cleanedProject = cleanProjectBeforeSave(safeProject, status);
      const validationErrors = validateProject(cleanedProject, mode);

      if (Object.values(validationErrors).some(Boolean)) {
        setErrors(validationErrors);
        notify("error", "Check fields");
        return;
      }

      const savedProject = await saveMyProject(cleanedProject);
      const savedProjectId = savedProject?.id;

      let projectAfterUploads = savedProject;
      const newScreenshotFiles = (cleanedProject.screenshots || []).filter(
        (screenshot) => screenshot?.file instanceof File
      );

      if (savedProjectId) {
        const keptScreenshotIds = new Set(
          (cleanedProject.screenshots || [])
            .map((screenshot) => screenshot?.id)
            .filter(Boolean)
            .map(String)
        );

        const removedScreenshots = (projectBeforeEdit?.screenshots || []).filter(
          (screenshot) => screenshot?.id && !keptScreenshotIds.has(String(screenshot.id))
        );

        for (const screenshot of removedScreenshots) {
          await deleteProjectScreenshot(savedProjectId, screenshot.id);
        }

        for (const screenshot of newScreenshotFiles) {
          await uploadProjectScreenshot(savedProjectId, screenshot.file);
        }

        if (removedScreenshots.length || newScreenshotFiles.length) {
          // Re-fetch the project after upload/delete so SQLite screenshot rows
          // are returned with real IDs and backend `/uploads/...` URLs.
          projectAfterUploads = await getProjectById(savedProjectId);
        }
      }

      const normalizedProject = normalizeProjectFromApi(projectAfterUploads);

      const shouldKeepEditing = mode === "draft" && keepEditingAfterDraft;

      setProject(normalizedProject);
      setDraftProject(normalizedProject);
      setProjectBeforeEdit(shouldKeepEditing ? normalizedProject : null);
      setErrors({});
      setIsEditing(shouldKeepEditing);

      if (typeof onSaved === "function") {
        onSaved(normalizedProject, mode);
      }

      notify(
        "success",
        mode === "publish"
          ? "Published"
          : mode === "submit_review"
            ? "Submitted for coach review"
            : "Draft saved"
      );
    } catch (error) {
      console.error(error);
      notify("error", "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return {
    safeProject,
    isEditing,
    saving,
    errors,
    toast,
    setToast,
    notify,
    startEditing,
    cancelEditing,
    updateProject,
    saveDraft: () => saveProject("draft"),
    submitForReview: () => saveProject("submit_review"),
    publishProject: () => saveProject("publish"),
  };
}
