import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquareText,
  Send,
  X,
} from "lucide-react";
import {
  COACH_FEEDBACK_SECTIONS,
  COACH_GENERAL_FEEDBACK_SECTION,
  getCoachProjectById,
  sendCoachFeedback,
  updateCoachProjectStatus,
} from "./coachApi";
import { getProjectStatusInfo } from "../student/feedback/utils/feedbackHelpers";
function getArrayLabels(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.name || item?.title || item?.label || item?.role || item?.email || "";
    })
    .filter(Boolean);
}

function getSectionType(section) {
  if (section === "Screenshots") return "screenshots";
  if (["Features", "Tools", "Skills", "Team", "Links & resume"].includes(section)) return "chips";
  return "text";
}

function getProjectSectionPreview(project, section) {
  if (!project) return "";

  if (section === "Project summary") {
    return project.summary || project.overview || project.description || "";
  }

  if (section === "Problem") {
    return project.businessProblem || project.problem || project.challenge || "";
  }

  if (section === "Solution") {
    return project.solution || project.solutionOverview || project.approach || "";
  }

  if (section === "Architecture") {
    return project.architecture || project.architectureOverview || project.technicalArchitecture || "";
  }

  if (section === "Role") {
    return project.role || project.myRole || project.contribution || "";
  }

  if (section === "Results") {
    return project.results || project.outcomes || project.impact || "";
  }

  if (section === "Features") return getArrayLabels(project.features);
  if (section === "Tools") return getArrayLabels(project.tools);
  if (section === "Skills") return getArrayLabels(project.skills);

  if (section === "Team") {
    if (project.isSoloProject) return ["Solo project"];
    return getArrayLabels(project.teamMembers);
  }

  if (section === "Screenshots") {
    const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
    return screenshots.length ? `${screenshots.length} screenshot${screenshots.length > 1 ? "s" : ""} uploaded` : "";
  }

  if (section === "Links & resume") {
    return [project.githubUrl && "GitHub", project.demoUrl && "Demo", project.resumeUrl && "Resume"].filter(Boolean);
  }

  return project[section] || "";
}

function isGeneralFeedback(item) {
  const type = String(item?.type || item?.feedbackType || item?.feedback_type || item?.scope || "")
    .trim()
    .toLowerCase();
  const section = String(item?.section || item?.sectionName || item?.section_name || "")
    .trim()
    .toLowerCase();

  return (
    type === "general" ||
    type === "overall" ||
    type === "project" ||
    section === COACH_GENERAL_FEEDBACK_SECTION.toLowerCase() ||
    section.includes("overall")
  );
}

function getSectionFeedback(project, section) {
  return (Array.isArray(project?.reviewFeedback) ? project.reviewFeedback : []).filter(
    (item) => !isGeneralFeedback(item) && String(item?.section || "Project summary") === String(section)
  );
}

function getGeneralFeedback(project) {
  return (Array.isArray(project?.reviewFeedback) ? project.reviewFeedback : []).filter(isGeneralFeedback);
}

function getFeedbackMessage(item) {
  return item?.message || item?.feedback || item?.comment || item?.note || "";
}

function getCoachReviewStatus(status) {
  const normalized = String(status || "needs_revision")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  return normalized === "ready" || normalized === "published" ? "ready" : "needs_revision";
}

function getSectionPreview(project, section, feedbackItems) {
  const projectPreview = getProjectSectionPreview(project, section);
  if (Array.isArray(projectPreview) && projectPreview.length) return projectPreview;
  if (typeof projectPreview === "string" && projectPreview.trim()) return projectPreview;
  return getFeedbackMessage(feedbackItems[0]) || "Select this section to write clear feedback.";
}

function CoachOverallFeedbackCard({ project, selected, onSelect }) {
  const items = getGeneralFeedback(project);
  const openCount = items.filter((item) => !(item.isResolved ?? item.is_resolved)).length;
  const isResolved = items.length > 0 && openCount === 0;
  return (
    <button
      type="button"
      className={`coach-review-section-card coach-review-overall-card ${selected ? "coach-review-section-card-active" : ""}`}
      onClick={onSelect}
    >
      <div className="coach-review-section-header">
        <strong>{COACH_GENERAL_FEEDBACK_SECTION}</strong>
        {items.length > 0 ? (
          <span className={`coach-review-pin ${isResolved ? "coach-review-pin-resolved" : "coach-review-pin-open"}`}>
            {isResolved ? <CheckCircle2 aria-hidden="true" /> : <MessageSquareText aria-hidden="true" />}
          </span>
        ) : null}
      </div>
    </button>
  );
}

function CoachSectionCard({ section, project, selected, onSelect }) {
  const items = getSectionFeedback(project, section);
  const openCount = items.filter((item) => !(item.isResolved ?? item.is_resolved)).length;
  const isResolved = items.length > 0 && openCount === 0;
  const type = getSectionType(section);
  const preview = getSectionPreview(project, section, items);

  return (
    <button
      type="button"
      className={`coach-review-section-card ${selected ? "coach-review-section-card-active" : ""}`}
      onClick={() => onSelect(section)}
    >
      <div className="coach-review-section-header">
        <strong>{section}</strong>
        {items.length > 0 ? (
          <span className={`coach-review-pin ${isResolved ? "coach-review-pin-resolved" : "coach-review-pin-open"}`}>
            {isResolved ? <CheckCircle2 aria-hidden="true" /> : <MessageSquareText aria-hidden="true" />}
          </span>
        ) : null}
      </div>

      {type === "screenshots" ? (
        <div className="coach-section-screenshot-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ) : type === "chips" ? (
        <div className="coach-section-chip-list">
          {(Array.isArray(preview) ? preview : [preview]).slice(0, 4).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : (
        <p>{preview}</p>
      )}
    </button>
  );
}

function CoachSectionInfoCard({ project, feedbackType, section, isViewOnly, onOpenFeedback }) {
  const title = feedbackType === "general" ? COACH_GENERAL_FEEDBACK_SECTION : section;
  const items = feedbackType === "general" ? getGeneralFeedback(project) : getSectionFeedback(project, section);
  const latestNote = items[0] ? getFeedbackMessage(items[0]) : "";
  const previewValue = feedbackType === "general"
    ? project.summary || project.overview || project.description || "This feedback covers the whole project."
    : getProjectSectionPreview(project, section);
  const type = feedbackType === "general" ? "text" : getSectionType(section);

  return (
    <section className="coach-card coach-section-info-card">
      <div className="coach-card-header coach-section-info-header">
        <div>
          <span className="coach-row-label">{feedbackType === "general" ? "General review" : "Selected section"}</span>
          <h2>{title}</h2>
        </div>

        {!isViewOnly ? (
          <button type="button" className="coach-soft-btn coach-give-feedback-btn" onClick={onOpenFeedback}>
            <MessageSquareText size={16} /> Give feedback
          </button>
        ) : null}
      </div>

      <div className="coach-section-info-body">
        {type === "screenshots" ? (
          <>
            <div className="coach-section-screenshot-lines coach-section-screenshot-lines-large" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="coach-section-info-text">{previewValue || "No screenshots uploaded yet."}</p>
          </>
        ) : type === "chips" ? (
          <div className="coach-section-chip-list coach-section-chip-list-large">
            {(Array.isArray(previewValue) ? previewValue : []).length ? (
              (Array.isArray(previewValue) ? previewValue : []).map((label) => <span key={label}>{label}</span>)
            ) : (
              <p className="coach-section-info-text">No items added yet.</p>
            )}
          </div>
        ) : (
          <p className="coach-section-info-text">{previewValue || "No information added yet."}</p>
        )}
      </div>

      {latestNote ? (
        <div className="coach-section-latest-note">
          <span className="coach-row-label">Latest note</span>
          <p>{latestNote}</p>
        </div>
      ) : null}

      {isViewOnly ? (
        <div className="coach-view-only-note coach-view-only-note-compact">
          This published project is open in view-only mode. Feedback and status changes are disabled.
        </div>
      ) : null}
    </section>
  );
}

function CoachProjectReviewPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [feedbackType, setFeedbackType] = useState("section");
  const [section, setSection] = useState("Project summary");
  const [status, setStatus] = useState("needs_revision");
  const [message, setMessage] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    getCoachProjectById(projectId).then((data) => {
      setProject(data);
      setStatus(getCoachReviewStatus(data?.status));
      setLoading(false);
    });
  }, [projectId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim() || saving) return;

    setSaving(true);
    try {
      const updatedProject = await sendCoachFeedback(projectId, {
        type: feedbackType,
        feedbackType,
        section: feedbackType === "general" ? COACH_GENERAL_FEEDBACK_SECTION : section,
        status: status || "needs_revision",
        message: message.trim(),
      });
      setProject(updatedProject);
      setStatus(getCoachReviewStatus(updatedProject.status));
      setMessage("");
      setIsFeedbackModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusDecision(nextStatus) {
    if (statusSaving || !["needs_revision", "ready"].includes(nextStatus)) return;

    setStatus(nextStatus);
    setStatusSaving(true);

    try {
      const updatedProject = await updateCoachProjectStatus(projectId, nextStatus);
      if (updatedProject) {
        setProject(updatedProject);
        setStatus(getCoachReviewStatus(updatedProject.status));
      }
    } finally {
      setStatusSaving(false);
    }
  }

  if (loading) {
    return <div className="coach-page"><div className="coach-empty">Loading project...</div></div>;
  }

  if (!project) {
    return (
      <div className="coach-page">
        <button type="button" className="coach-soft-btn" onClick={() => navigate("/coach/projects")}><ArrowLeft size={16} />Back</button>
        <div className="coach-empty">Project not found.</div>
      </div>
    );
  }

  const statusInfo = getProjectStatusInfo(project.status);
  const isViewOnly = searchParams.get("mode") === "view" || String(project.status || "").toLowerCase() === "published";

  return (
    <div className="coach-page coach-review-page">
      <header className="coach-page-header">
        <div className="coach-page-heading coach-page-heading-with-back">
          <button type="button" className="coach-icon-btn" onClick={() => navigate("/coach/projects")} aria-label="Back to projects">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Project feedback</h1>
          </div>
        </div>
        <div className="coach-header-actions">
          <span className={`coach-status-pill coach-status-${statusInfo.key}`}>{statusInfo.label}</span>
        </div>
      </header>

      <div className="coach-review-layout">
        <section className="coach-card coach-review-work-card">
          <div className="coach-card-header">
            <div>
              <span className="coach-row-label">Student project</span>
              <h2>{project.title || "Untitled project"}</h2>
              <p>{project.studentName}</p>
            </div>
          </div>

          <div className="coach-review-section-grid">
            <CoachOverallFeedbackCard
              project={project}
              selected={feedbackType === "general"}
              onSelect={() => setFeedbackType("general")}
            />

            {COACH_FEEDBACK_SECTIONS.map((item) => (
              <CoachSectionCard
                key={item}
                section={item}
                project={project}
                selected={feedbackType === "section" && item === section}
                onSelect={(nextSection) => {
                  setFeedbackType("section");
                  setSection(nextSection);
                }}
              />
            ))}
          </div>
        </section>

        <aside className="coach-review-side coach-review-side-single">
          <CoachSectionInfoCard
            project={project}
            feedbackType={feedbackType}
            section={section}
            isViewOnly={isViewOnly}
            onOpenFeedback={() => setIsFeedbackModalOpen(true)}
          />
        </aside>
      </div>

      {isFeedbackModalOpen && !isViewOnly ? (
        <div className="coach-feedback-modal-overlay" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="coach-feedback-modal" onClick={(event) => event.stopPropagation()}>
            <div className="coach-feedback-modal-header">
              <div>
                <h2>{feedbackType === "general" ? COACH_GENERAL_FEEDBACK_SECTION : section}</h2>
              </div>
              <button type="button" className="coach-icon-btn coach-modal-close-btn" onClick={() => setIsFeedbackModalOpen(false)} aria-label="Close feedback modal">
                <X size={18} />
              </button>
            </div>

            <form className="coach-form-grid" onSubmit={handleSubmit}>
              <div className="coach-form-field coach-form-field-full coach-feedback-type-field">
                <span>Feedback type</span>
                <div className="coach-feedback-type-toggle" role="group" aria-label="Feedback type">
                  <button
                    type="button"
                    className={`coach-feedback-type-option ${feedbackType === "general" ? "coach-feedback-type-option-active" : ""}`}
                    onClick={() => setFeedbackType("general")}
                  >
                    <MessageSquareText aria-hidden="true" />
                    <strong>Overall feedback</strong>
                  </button>

                  <button
                    type="button"
                    className={`coach-feedback-type-option ${feedbackType === "section" ? "coach-feedback-type-option-active" : ""}`}
                    onClick={() => setFeedbackType("section")}
                  >
                    <CheckCircle2 aria-hidden="true" />
                    <strong>Section feedback</strong>
                  </button>
                </div>
              </div>

              <div className="coach-form-field coach-form-field-full coach-decision-field">
                <span>Coach decision</span>
                <div className="coach-decision-toggle" role="group" aria-label="Project review decision">
                  <button
                    type="button"
                    className={`coach-decision-option coach-decision-revision ${status === "needs_revision" ? "coach-decision-option-active" : ""}`}
                    onClick={() => handleStatusDecision("needs_revision")}
                    disabled={statusSaving}
                  >
                    <MessageSquareText aria-hidden="true" />
                    <strong>Needs revision</strong>
                  </button>

                  <button
                    type="button"
                    className={`coach-decision-option coach-decision-ready ${status === "ready" ? "coach-decision-option-active" : ""}`}
                    onClick={() => handleStatusDecision("ready")}
                    disabled={statusSaving}
                  >
                    <CheckCircle2 aria-hidden="true" />
                    <strong>Ready</strong>
                  </button>
                </div>
              </div>

              <label className="coach-form-field coach-form-field-full">
                <span>Feedback message</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={
                    feedbackType === "general"
                      ? "Write overall feedback for the whole project..."
                      : `Write feedback for ${section}...`
                  }
                />
              </label>

              <div className="coach-form-field-full coach-modal-actions">
                <button type="button" className="coach-soft-btn" onClick={() => setIsFeedbackModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="coach-primary-btn" disabled={saving || !message.trim()}>
                  <Send size={16} /> {saving ? "Sending..." : "Send feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CoachProjectReviewPage;
