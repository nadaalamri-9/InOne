import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, MessageSquareText, Pencil } from "lucide-react";

import FeedbackStatsGrid from "../components/FeedbackStatsGrid";
import { useFeedback } from "../hooks/useFeedback";
import { FEEDBACK_SECTION_ORDER, GENERAL_FEEDBACK_SECTION, formatFeedbackDate, getProjectStatusInfo } from "../utils/feedbackHelpers";
function getProjectCover(project) {
  const screenshots = Array.isArray(project?.screenshots) ? project.screenshots : [];
  const firstScreenshot = screenshots[0];

  if (typeof firstScreenshot === "string") return firstScreenshot;

  return (
    firstScreenshot?.preview ||
    firstScreenshot?.url ||
    firstScreenshot?.imageUrl ||
    firstScreenshot?.image_url ||
    firstScreenshot?.src ||
    project?.coverImage ||
    project?.cover_image ||
    project?.imageUrl ||
    project?.image_url ||
    ""
  );
}

function getProjectSummaryLine(project) {
  return (
    project?.summary ||
    project?.overview ||
    project?.description ||
    "Open this project to review coach feedback and fix the requested sections."
  );
}

function getArrayLabels(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.name || item?.title || item?.label || item?.role || item?.email || "";
    })
    .filter(Boolean);
}

function getSectionLines(section) {
  if (section === "Screenshots") return "screenshots";
  if (["Features", "Tools", "Skills", "Team", "Links & resume"].includes(section)) return "chips";
  return "text";
}

function getProjectSectionPreview(project, section) {
  if (!project) return "";

  if (section === "Project summary") {
    return project.summary || project.overview || project.description || "No project summary added yet.";
  }

  if (section === "Problem") {
    return project.businessProblem || project.problem || project.challenge || "No problem statement added yet.";
  }

  if (section === "Solution") {
    return project.solution || project.solutionOverview || project.approach || "No solution details added yet.";
  }

  if (section === "Architecture") {
    return project.architecture || project.architectureOverview || project.technicalArchitecture || "No architecture details added yet.";
  }

  if (section === "Role") {
    return project.role || project.myRole || project.contribution || "No role details added yet.";
  }

  if (section === "Results") {
    return project.results || project.outcomes || project.impact || "No results added yet.";
  }

  if (section === "Features") {
    const features = getArrayLabels(project.features);
    return features.length ? features : ["No features added yet"];
  }

  if (section === "Tools") {
    const tools = getArrayLabels(project.tools);
    return tools.length ? tools : ["No tools added yet"];
  }

  if (section === "Skills") {
    const skills = getArrayLabels(project.skills);
    return skills.length ? skills : ["No skills added yet"];
  }

  if (section === "Team") {
    if (project.isSoloProject) return ["Solo project"];
    const members = getArrayLabels(project.teamMembers);
    return members.length ? members : ["No team members added yet"];
  }

  if (section === "Screenshots") {
    const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
    return screenshots.length ? `${screenshots.length} screenshot${screenshots.length > 1 ? "s" : ""} uploaded` : "No screenshots uploaded yet.";
  }

  if (section === "Links & resume") {
    const links = [project.githubUrl && "GitHub", project.demoUrl && "Demo", project.resumeUrl && "Resume"].filter(Boolean);
    return links.length ? links : ["No links added yet"];
  }

  return project[section] || "No details added yet.";
}


function isEmptyPreview(preview) {
  if (Array.isArray(preview)) {
    return !preview.length || preview.every((item) => String(item || "").trim().toLowerCase().startsWith("no "));
  }

  const text = String(preview || "").trim().toLowerCase();
  return !text || text.startsWith("no ");
}

function getVisibleSectionPreview(projectPreview, fallbackMessage) {
  if (!isEmptyPreview(projectPreview)) return projectPreview;
  return fallbackMessage || "Coach added a note for this section.";
}

function getProgressPercent(resolved, total) {
  return total ? Math.round((resolved / total) * 100) : 0;
}

function SectionPreview({ section, items, project, activeId }) {
  const openItems = items.filter((item) => !item.isResolved);
  const firstOpen = openItems[0] || items[0];
  const state = !items.length ? "empty" : openItems.length ? "open" : "resolved";
  const lineType = getSectionLines(section);
  const projectPreview = getProjectSectionPreview(project, section);
  const preview = getVisibleSectionPreview(projectPreview, firstOpen?.message);
  const isActive = Boolean(items.some((item) => item.id === activeId));

  return (
    <article className={`feedback-work-section feedback-work-section-${state} ${isActive ? "feedback-work-section-active" : ""}`}>
      <div className="feedback-work-section-main">
        <div className="feedback-section-title-row">
          <strong>{section}</strong>
          {items.length > 0 && (
            <span className={`feedback-work-pin feedback-work-pin-${state}`}>
              {state === "resolved" ? <Check aria-hidden="true" /> : <MessageSquareText aria-hidden="true" />}
            </span>
          )}
        </div>

        {lineType === "screenshots" ? (
          <div className="feedback-shot-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : lineType === "chips" ? (
          <div className="feedback-section-chip-list">
            {(Array.isArray(preview) ? preview : [preview]).slice(0, 4).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        ) : (
          <p className="feedback-section-preview-text">{preview}</p>
        )}
      </div>
    </article>
  );
}

function CoachAvatar({ item }) {
  if (item?.coachPhoto) {
    return <img src={item.coachPhoto} alt={item.coachName} />;
  }

  return <span>{item?.coachInitials || "C"}</span>;
}

function EmptyFeedbackState() {
  return (
    <section className="feedback-no-data-card">
      <MessageSquareText aria-hidden="true" />
      <h2>No feedback yet</h2>
      <Link to="/project" className="feedback-primary-link">
        Go to projects
        <ArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}

function ProjectPicker({ projects, onSelect }) {
  return (
    <section className="feedback-project-picker" aria-label="Project feedback cards">
      <div className="feedback-project-card-grid">
        {projects.map((project) => {
          const progress = getProgressPercent(project.feedbackResolved, project.feedbackTotal);
          const statusInfo = getProjectStatusInfo(project.status);
          const cover = getProjectCover(project);
          const lastNote = project.feedbackItems?.[0]?.createdAt || project.updatedAt || "";

          return (
            <button
              type="button"
              key={project.id || project.title}
              className="feedback-project-card"
              onClick={() => onSelect(project.id)}
            >
              <div className="feedback-project-card-cover">
                {cover ? (
                  <img src={cover} alt="" />
                ) : (
                  <div className="feedback-project-card-empty-cover">
                    <ImagePlus aria-hidden="true" />
                    <span>No image yet</span>
                  </div>
                )}

                <span className={`feedback-status-pill feedback-status-${statusInfo.key}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="feedback-project-card-body">
                <h3>{project.title || "Untitled project"}</h3>
                <p>{getProjectSummaryLine(project)}</p>

                <div className="feedback-project-card-note-row">
                  <span>{project.feedbackOpen} open notes</span>
                  <span>{project.feedbackResolved} marked</span>
                </div>

                <div className="feedback-mini-progress" aria-label={`${progress}% marked`}>
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="feedback-project-card-footer">
                <span>Review comments</span>
                <span>{formatFeedbackDate(lastNote)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function OverallFeedbackPanel({ items, activeId, onOpen }) {
  if (!items.length) return null;

  return (
    <section className="feedback-overall-compact-wrap" aria-label="Overall project feedback">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            type="button"
            key={item.id}
            className={`feedback-overall-compact-card ${isActive ? "feedback-overall-compact-card-active" : ""} ${
              item.isResolved ? "feedback-overall-compact-card-marked" : ""
            }`}
            onClick={() => onOpen(item)}
            disabled={item.isResolved}
          >
            <span className="feedback-overall-compact-text">
              <strong>Overall project feedback</strong>
            </span>

            <span
              className={`feedback-overall-compact-icon ${
                item.isResolved ? "feedback-overall-compact-icon-marked" : ""
              }`}
              aria-hidden="true"
            >
              {item.isResolved ? <Check /> : <MessageSquareText />}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function ActiveMessage({ item }) {
  if (!item) {
    return (
      <article className="feedback-active-comment feedback-active-comment-empty">
        <MessageSquareText aria-hidden="true" />
        <h3>No message selected</h3>
        <p>Open a review comment to see the coach message.</p>
      </article>
    );
  }

  return (
    <article className="feedback-active-comment">
      <div className="feedback-message-topline">
        <span className="feedback-row-label">Message</span>
        <span className="feedback-message-date">{formatFeedbackDate(item.createdAt)}</span>
      </div>

      <div className="feedback-active-header">
        <div className="feedback-active-avatar">
          <CoachAvatar item={item} />
        </div>

        <div className="feedback-message-person">
          <h3>{item.coachName}</h3>
          <span>{item.section}</span>
        </div>
      </div>

      <div className="feedback-active-message-box">
        <span className="feedback-row-label">Coach note</span>
        <p className="feedback-active-message">{item.message}</p>
      </div>
    </article>
  );
}

function ReviewComments({ items, activeId, onOpen, onToggleResolved }) {
  const resolvedCount = items.filter((item) => item.isResolved).length;
  const totalCount = items.length;
  const progress = getProgressPercent(resolvedCount, totalCount);

  return (
    <section className="feedback-review-panel">
      <div className="feedback-review-panel-header">
        <div>
          <h2>Review comments</h2>
        </div>
        <strong>
          {resolvedCount} / {totalCount} marked
        </strong>
      </div>

      <div className="feedback-review-progress" aria-label={`${progress}% marked`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="feedback-review-list">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const actionLabel = item.isResolved ? "Marked" : isActive ? "Mark" : "Open";
          const actionClass = item.isResolved
            ? "feedback-review-marked-action"
            : isActive
              ? "feedback-review-mark-action"
              : "feedback-review-open-action";
          const handleAction = () => {
            if (item.isResolved) return;
            if (isActive) {
              onToggleResolved(item);
              return;
            }
            onOpen(item);
          };

          return (
            <article
              key={item.id}
              className={`feedback-review-item ${isActive ? "feedback-review-item-active" : ""} ${
                item.isResolved ? "feedback-review-item-resolved" : ""
              }`}
            >
              <button type="button" className="feedback-review-item-main" onClick={() => onOpen(item)}>
                <span className="feedback-review-dot" />
                <h3>{item.section}</h3>
              </button>

              <div className="feedback-review-actions">
                <button
                  type="button"
                  className={`feedback-review-action ${actionClass}`}
                  onClick={handleAction}
                  disabled={item.isResolved}
                >
                  {actionLabel}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getEditPath(projectId) {
  return `/project/${projectId}/edit`;
}

function FeedbackPage() {
  const { loading, error, projectsWithFeedback, stats, toggleFeedbackResolved } = useFeedback();
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams();
  const isDetailPage = Boolean(routeProjectId);
  const detailRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!projectsWithFeedback.length) {
      setSelectedProjectId(null);
      return;
    }

    const selectedExists = projectsWithFeedback.some(
      (project) => String(project.id) === String(selectedProjectId)
    );

    if (!selectedExists) {
      const firstWithOpenNotes = projectsWithFeedback.find((project) => project.feedbackOpen > 0);
      setSelectedProjectId((firstWithOpenNotes || projectsWithFeedback[0]).id);
    }
  }, [projectsWithFeedback, selectedProjectId]);

  const selectedProject = useMemo(
    () => {
      if (routeProjectId) {
        return (
          projectsWithFeedback.find((project) => String(project.id) === String(routeProjectId)) ||
          null
        );
      }

      return (
        projectsWithFeedback.find((project) => String(project.id) === String(selectedProjectId)) ||
        projectsWithFeedback[0] ||
        null
      );
    },
    [projectsWithFeedback, routeProjectId, selectedProjectId]
  );

  const selectedFeedbackItems = useMemo(() => selectedProject?.feedbackItems || [], [selectedProject]);
  const generalFeedbackItems = useMemo(
    () => selectedFeedbackItems.filter((item) => item.type === "general" || item.section === GENERAL_FEEDBACK_SECTION),
    [selectedFeedbackItems]
  );
  const sectionFeedbackItems = useMemo(
    () => selectedFeedbackItems.filter((item) => item.type !== "general" && item.section !== GENERAL_FEEDBACK_SECTION),
    [selectedFeedbackItems]
  );

  useEffect(() => {
    if (!selectedFeedbackItems.length) {
      setActiveId(null);
      return;
    }

    if (!activeId) return;

    const currentItem = selectedFeedbackItems.find((item) => item.id === activeId);
    if (!currentItem || currentItem.isResolved) {
      setActiveId(null);
    }
  }, [activeId, selectedFeedbackItems]);

  const activeItem = useMemo(
    () => selectedFeedbackItems.find((item) => item.id === activeId && !item.isResolved) || null,
    [activeId, selectedFeedbackItems]
  );

  const sections = useMemo(() => {
    const commentedSections = sectionFeedbackItems
      .map((item) => item.section)
      .filter(Boolean);

    const orderedSections = FEEDBACK_SECTION_ORDER.filter((section) => commentedSections.includes(section));
    const extraSections = commentedSections.filter((section) => !FEEDBACK_SECTION_ORDER.includes(section));
    const visibleSections = [...orderedSections, ...new Set(extraSections)];

    return visibleSections.map((section) => ({
      name: section,
      items: sectionFeedbackItems.filter((item) => item.section === section),
    }));
  }, [sectionFeedbackItems]);

  function scrollToDetails() {
    window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function handleProjectSelect(projectId) {
    setSelectedProjectId(projectId);
    setActiveId(null);
    navigate(`/feedback/${projectId}`);
  }

  function handleOpen(item) {
    if (!item || item.isResolved) return;
    setActiveId(item.id);
    scrollToDetails();
  }

  function handleToggleResolved(item) {
    toggleFeedbackResolved(item);
    if (String(activeId) === String(item?.id)) {
      setActiveId(null);
    }
  }

  function handleEditProject() {
    if (!selectedProject?.id) return;
    navigate(getEditPath(selectedProject.id));
  }

  function handleBackToFeedback() {
    navigate("/feedback");
  }

  return (
    <div className="feedback-page feedback-student-page">
      {!isDetailPage && (
        <>
          <header className="feedback-page-header">
            <h1>Feedback</h1>
            <p>Track all coaching notes and project feedback in one place</p>
          </header>

          <FeedbackStatsGrid stats={stats} />
        </>
      )}

      {loading ? (
        <div className="feedback-state-card feedback-student-loading">Loading feedback...</div>
      ) : error ? (
        <div className="feedback-state-card feedback-error-card feedback-student-loading">{error}</div>
      ) : !projectsWithFeedback.length ? (
        <EmptyFeedbackState />
      ) : !isDetailPage ? (
        <ProjectPicker
          projects={projectsWithFeedback}
          selectedProjectId={selectedProject?.id}
          onSelect={handleProjectSelect}
        />
      ) : !selectedProject ? (
        <div className="feedback-state-card feedback-error-card feedback-student-loading">Project feedback not found.</div>
      ) : (
        <>
          <header className="feedback-page-header feedback-page-header-with-back feedback-page-header-arrow-only feedback-project-feedback-header">
            <button type="button" className="feedback-detail-back-button" onClick={handleBackToFeedback} aria-label="Back to feedback">
              <ArrowLeft aria-hidden="true" />
            </button>
            <h1>Project feedback</h1>
          </header>

          <div className="feedback-student-layout" ref={detailRef}>
          <section className="feedback-project-preview-card" aria-label="Project feedback preview">
            <div className="feedback-project-preview-header">
              <div className="feedback-project-title-block">
                <span className="feedback-row-label">Selected project</span>
                <h2>{selectedProject?.title || "Student project"}</h2>
                <span className={`feedback-status-pill feedback-status-${getProjectStatusInfo(selectedProject?.status).key}`}>
                  {getProjectStatusInfo(selectedProject?.status).label}
                </span>
              </div>

              {selectedProject?.id && (
                <button type="button" className="feedback-edit-project-button" onClick={handleEditProject}>
                  <Pencil aria-hidden="true" />
                  Edit project
                </button>
              )}
            </div>

            <OverallFeedbackPanel items={generalFeedbackItems} activeId={activeId} onOpen={handleOpen} />

            <div className="feedback-work-sections">
              {sections.map((section) => (
                <SectionPreview
                  key={section.name}
                  section={section.name}
                  project={selectedProject}
                  items={section.items}
                  activeId={activeId}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </section>

          <aside className="feedback-student-side" aria-label="Student review actions">
            <ActiveMessage item={activeItem} />

            <ReviewComments
              items={selectedFeedbackItems}
              activeId={activeId}
              onOpen={handleOpen}
              onToggleResolved={handleToggleResolved}
            />
          </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default FeedbackPage;
