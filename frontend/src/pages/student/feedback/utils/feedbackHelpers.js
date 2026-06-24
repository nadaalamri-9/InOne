export const GENERAL_FEEDBACK_SECTION = "Overall project feedback";

export const FEEDBACK_SECTION_ORDER = [
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

export function formatFeedbackDate(value) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function normalizeStatusKey(status) {
  return String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function getProjectStatusInfo(status) {
  const key = normalizeStatusKey(status);

  if (key === "published") return { key: "published", label: "Published" };
  if (key === "ready") return { key: "ready", label: "Ready" };
  if (key === "needs_revision") return { key: "needs-revision", label: "Needs revision" };
  if (key === "in_progress") return { key: "in-progress", label: "In progress" };

  return { key: "draft", label: "Draft" };
}

export function getSectionKey(section) {
  const text = String(section || "")
    .trim()
    .toLowerCase();

  if (
    text === GENERAL_FEEDBACK_SECTION.toLowerCase() ||
    text.includes("overall") ||
    text.includes("general") ||
    text.includes("whole project") ||
    text.includes("project review")
  ) {
    return GENERAL_FEEDBACK_SECTION;
  }

  if (text.includes("summary") || text.includes("overview") || text.includes("impact")) {
    return "Project summary";
  }

  if (text.includes("problem") || text.includes("business") || text.includes("challenge")) {
    return "Problem";
  }

  if (text.includes("solution") && !text.includes("architecture")) {
    return "Solution";
  }

  if (text.includes("architect") || text.includes("flow") || text.includes("diagram") || text.includes("data flow")) {
    return "Architecture";
  }

  if (text.includes("role") || text.includes("responsibility") || text.includes("contribution")) {
    return "Role";
  }

  if (text.includes("result") || text.includes("outcome") || text.includes("metric") || text.includes("measurable")) {
    return "Results";
  }

  if (text.includes("feature") || text.includes("functionality")) {
    return "Features";
  }

  if (text.includes("tool") || text.includes("technology") || text.includes("tech stack") || text.includes("stack")) {
    return "Tools";
  }

  if (text.includes("skill")) {
    return "Skills";
  }

  if (text.includes("team") || text.includes("member") || text.includes("solo")) {
    return "Team";
  }

  if (text.includes("screenshot") || text.includes("image") || text.includes("media") || text.includes("hero")) {
    return "Screenshots";
  }

  if (text.includes("link") || text.includes("resume") || text.includes("github") || text.includes("url") || text.includes("demo")) {
    return "Links & resume";
  }

  return section || "Project summary";
}

function getFeedbackMessage(item) {
  if (typeof item === "string") return item;
  return item?.message || item?.feedback || item?.comment || item?.note || item?.content || "";
}

function getFeedbackDate(item, project) {
  if (typeof item === "string") return project.updatedAt || "";
  return (
    item?.sentAt ||
    item?.sent_at ||
    item?.createdAt ||
    item?.created_at ||
    item?.date ||
    item?.timestamp ||
    project.updatedAt ||
    ""
  );
}

function getCoachName(item) {
  if (typeof item === "string") return "Coach";
  return (
    item?.coachName ||
    item?.coach_name ||
    item?.teacherName ||
    item?.teacher_name ||
    item?.reviewerName ||
    item?.reviewer_name ||
    item?.coach?.name ||
    item?.teacher?.name ||
    item?.reviewer?.name ||
    item?.user?.name ||
    "Coach"
  );
}

function getCoachPhoto(item) {
  if (typeof item === "string") return "";

  const directPhoto =
    item?.coachPhotoUrl ||
    item?.coach_photo_url ||
    item?.coachPhoto ||
    item?.coach_photo ||
    item?.coachAvatar ||
    item?.coach_avatar ||
    item?.teacherPhotoUrl ||
    item?.teacher_photo_url ||
    item?.teacherPhoto ||
    item?.teacher_photo ||
    item?.profilePhoto ||
    item?.profile_photo ||
    item?.profileImage ||
    item?.profile_image ||
    item?.avatarUrl ||
    item?.avatar_url ||
    item?.photoUrl ||
    item?.photo_url ||
    item?.coach?.photoUrl ||
    item?.coach?.photo_url ||
    item?.coach?.avatarUrl ||
    item?.coach?.avatar_url ||
    item?.teacher?.photoUrl ||
    item?.teacher?.photo_url ||
    item?.teacher?.avatarUrl ||
    item?.teacher?.avatar_url ||
    item?.reviewer?.photoUrl ||
    item?.reviewer?.photo_url ||
    item?.reviewer?.avatarUrl ||
    item?.reviewer?.avatar_url ||
    "";

  if (directPhoto) return directPhoto;

  const profile =
    item?.coachProfile || item?.coach_profile || item?.teacherProfile || item?.teacher_profile || item?.profile;

  if (typeof profile === "string") return profile;

  return profile?.photoUrl || profile?.photo_url || profile?.avatarUrl || profile?.avatar_url || "";
}

function getFeedbackType(item) {
  if (typeof item === "string") return "section";

  const rawType = String(
    item?.type ||
      item?.feedbackType ||
      item?.feedback_type ||
      item?.scope ||
      item?.feedbackScope ||
      item?.feedback_scope ||
      ""
  )
    .trim()
    .toLowerCase();

  const sectionText = String(item?.section || item?.sectionName || item?.section_name || "")
    .trim()
    .toLowerCase();

  return rawType === "general" ||
    rawType === "overall" ||
    rawType === "project" ||
    sectionText === GENERAL_FEEDBACK_SECTION.toLowerCase() ||
    sectionText.includes("overall")
    ? "general"
    : "section";
}

function getFeedbackSection(item, index = 0, message = "") {
  if (getFeedbackType(item) === "general") {
    return GENERAL_FEEDBACK_SECTION;
  }

  if (typeof item !== "string") {
    const explicitSection =
      item?.section ||
      item?.sectionName ||
      item?.section_name ||
      item?.area ||
      item?.category ||
      item?.field ||
      item?.targetSection ||
      item?.target_section ||
      "";

    if (explicitSection) return getSectionKey(explicitSection);
  }

  const text = String(message || "").toLowerCase();

  if (text.includes("problem") || text.includes("business") || text.includes("challenge")) {
    return "Problem";
  }

  if (text.includes("architect") || text.includes("diagram") || text.includes("flow") || text.includes("data flow")) {
    return "Architecture";
  }

  if (text.includes("solution") || text.includes("approach")) {
    return "Solution";
  }

  if (text.includes("role") || text.includes("responsibility") || text.includes("contribution")) {
    return "Role";
  }

  if (text.includes("feature") || text.includes("functionality")) {
    return "Features";
  }

  if (text.includes("tool") || text.includes("technology") || text.includes("stack")) {
    return "Tools";
  }

  if (text.includes("skill")) {
    return "Skills";
  }

  if (text.includes("team") || text.includes("member") || text.includes("solo")) {
    return "Team";
  }

  if (text.includes("screenshot") || text.includes("image") || text.includes("hero") || text.includes("demo image")) {
    return "Screenshots";
  }

  if (text.includes("link") || text.includes("resume") || text.includes("linkedin") || text.includes("github") || text.includes("url") || text.includes("demo link")) {
    return "Links & resume";
  }

  if (text.includes("result") || text.includes("impact") || text.includes("measurable") || text.includes("metric")) {
    return "Results";
  }

  if (text.includes("summary") || text.includes("overview")) {
    return "Project summary";
  }

  return FEEDBACK_SECTION_ORDER[index % FEEDBACK_SECTION_ORDER.length];
}

function getFeedbackResolved(item) {
  if (typeof item === "string") return false;

  const status = String(item?.status || item?.state || "").toLowerCase();

  return Boolean(
    item?.isResolved ||
      item?.is_resolved ||
      item?.resolved ||
      item?.done ||
      item?.completed ||
      status === "resolved" ||
      status === "done" ||
      status === "completed"
  );
}

function getProjectTitleFromFeedback(item, project) {
  if (typeof item === "string") return project.title || "Untitled project";
  return (
    item?.projectTitle ||
    item?.project_title ||
    item?.studentProjectName ||
    item?.student_project_name ||
    item?.project?.title ||
    project.title ||
    "Untitled project"
  );
}

function getProjectIdFromFeedback(item, project) {
  if (typeof item === "string") return project.id;
  return item?.projectId || item?.project_id || item?.project?.id || project.id;
}

function getFeedbackSourceId(item) {
  if (typeof item === "string") return null;
  return item?.id ?? item?.feedbackId ?? item?.feedback_id ?? null;
}

function getInitials(name) {
  return (
    String(name || "Coach")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "C"
  );
}

export function buildFeedbackItems(projects) {
  return projects
    .flatMap((project) => {
      const feedbackList = Array.isArray(project.reviewFeedback) ? project.reviewFeedback : [];

      return feedbackList.map((item, index) => {
        const coachName = getCoachName(item);
        const projectStatus = getProjectStatusInfo(project.status);
        const message = getFeedbackMessage(item);
        const feedbackSourceId = getFeedbackSourceId(item);
        const projectId = getProjectIdFromFeedback(item, project);

        return {
          id: `${projectId || project.title}-${feedbackSourceId || index}`,
          feedbackSourceId,
          feedbackIndex: index,
          projectId,
          projectTitle: getProjectTitleFromFeedback(item, project),
          projectStatus: projectStatus.label,
          projectStatusKey: projectStatus.key,
          message,
          type: getFeedbackType(item),
          feedbackType: getFeedbackType(item),
          section: getFeedbackSection(item, index, message),
          isResolved: getFeedbackResolved(item),
          createdAt: getFeedbackDate(item, project),
          coachName,
          coachPhoto: getCoachPhoto(item),
          coachInitials: getInitials(coachName),
        };
      });
    })
    .filter((item) => String(item.message || "").trim())
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });
}
