import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ListFilter, MessageSquareText, UserRound } from "lucide-react";
import { getCoachFeedbackItems } from "./coachApi";
import { formatFeedbackDate, getProjectStatusInfo } from "../student/feedback/utils/feedbackHelpers";
function groupFeedbackByProject(items) {
  const groups = new Map();

  items.forEach((item) => {
    const key = String(item.projectId || item.projectTitle || "project");
    const current = groups.get(key) || {
      projectId: item.projectId,
      projectTitle: item.projectTitle || "Untitled project",
      studentName: item.studentName || "Student",
      studentPhotoUrl: item.studentPhotoUrl || "",
      status: item.status || "needs_revision",
      items: [],
    };

    current.items.push(item);
    groups.set(key, current);
  });

  return Array.from(groups.values());
}

const COACH_FEEDBACK_FILTER_OPTIONS = [
  { value: "all", label: "All feedback" },
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "needs_revision", label: "Needs Revision" },
  { value: "ready", label: "Ready" },
];

function normalizeCoachFeedbackStatus(status) {
  const text = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (text === "needs_revision" || text === "needs_review") return "needs_revision";
  if (text === "ready") return "ready";
  return text;
}

function getFeedbackTime(item) {
  const date = new Date(item?.createdAt || 0).getTime();
  return Number.isNaN(date) ? 0 : date;
}

function getLatestGroupTime(group) {
  return Math.max(0, ...group.items.map(getFeedbackTime));
}

function filterAndSortFeedbackItems(items, filter) {
  const normalizedFilter = String(filter || "all");

  const visibleItems = items.filter((item) => {
    if (normalizedFilter === "needs_revision" || normalizedFilter === "ready") {
      return normalizeCoachFeedbackStatus(item.status) === normalizedFilter;
    }

    return true;
  });

  if (normalizedFilter === "oldest") {
    return [...visibleItems].sort((a, b) => getFeedbackTime(a) - getFeedbackTime(b));
  }

  return [...visibleItems].sort((a, b) => getFeedbackTime(b) - getFeedbackTime(a));
}

function CoachFeedbackPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    getCoachFeedbackItems().then(setItems);
  }, []);

  const filteredItems = useMemo(
    () => filterAndSortFeedbackItems(items, feedbackFilter),
    [items, feedbackFilter]
  );

  const activeFilterLabel = COACH_FEEDBACK_FILTER_OPTIONS.find(
    (option) => option.value === feedbackFilter
  )?.label || "All feedback";

  const projectGroups = useMemo(() => {
    const groups = groupFeedbackByProject(filteredItems);

    return [...groups].sort((a, b) => {
      if (feedbackFilter === "oldest") {
        return getLatestGroupTime(a) - getLatestGroupTime(b);
      }

      return getLatestGroupTime(b) - getLatestGroupTime(a);
    });
  }, [filteredItems, feedbackFilter]);

  const handleChangeFilter = (nextFilter) => {
    setFeedbackFilter(nextFilter);
    setFilterMenuOpen(false);
  };

  return (
    <div className="coach-page coach-feedback-dashboard-page">
      <header className="coach-page-header coach-feedback-header">
        <div className="coach-page-heading">
          <h1>Feedback</h1>
          <p>Review notes you sent. These are the same messages students see in their Feedback tab.</p>
        </div>

        {items.length ? (
          <div className="coach-feedback-filter-wrap">
            <button
              type="button"
              className={`coach-feedback-filter-btn ${filterMenuOpen ? "is-open" : ""}`}
              onClick={() => setFilterMenuOpen((current) => !current)}
              aria-expanded={filterMenuOpen}
              aria-haspopup="menu"
            >
              <ListFilter aria-hidden="true" />
              <span>{activeFilterLabel}</span>
            </button>

            {filterMenuOpen && (
              <div className="coach-feedback-filter-menu" role="menu">
                {COACH_FEEDBACK_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={option.value === feedbackFilter ? "is-selected" : ""}
                    onClick={() => handleChangeFilter(option.value)}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </header>

      {projectGroups.length ? (
        <div className="coach-feedback-projects-grid">
          {projectGroups.map((project) => {
            const openCount = project.items.filter((item) => !item.isResolved).length;
            const markedCount = project.items.length - openCount;
            const statusInfo = getProjectStatusInfo(project.status);
            const latest = project.items[0];

            return (
              <div className="coach-feedback-project-card-shell" key={project.projectId || project.projectTitle}>
                <article
                  className="coach-feedback-project-card coach-feedback-project-card-clickable"
                  role="button"
                tabIndex={0}
                onClick={() => navigate(`/coach/projects/${project.projectId}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/coach/projects/${project.projectId}`);
                  }
                }}
              >
                <div className="coach-feedback-project-header">
                  <div className="coach-avatar">
                    {project.studentPhotoUrl ? <img src={project.studentPhotoUrl} alt="" /> : <UserRound size={18} />}
                  </div>

                  <div>
                    <span className="coach-row-label">Student project</span>
                    <h2>{project.projectTitle}</h2>
                    <p>{project.studentName}</p>
                  </div>

                  <span className={`coach-status-pill coach-status-${statusInfo.key}`}>{statusInfo.label}</span>
                </div>

                <div className="coach-feedback-project-stats">
                  <span>{openCount} open</span>
                  <span>{markedCount} marked</span>
                  <span>{project.items.length} total</span>
                </div>

                <div className="coach-feedback-section-list">
                  {project.items.slice(0, 4).map((item) => (
                    <div className="coach-feedback-section-row" key={item.id}>
                      <span className={`coach-feedback-dot ${item.isResolved ? "coach-feedback-dot-marked" : ""}`} />
                      <div>
                        <strong>{item.section}</strong>
                        <p>{item.message}</p>
                      </div>
                      <span className={item.isResolved ? "coach-marked-chip" : "coach-open-chip"}>
                        {item.isResolved ? <CheckCircle2 size={13} /> : null}
                        {item.isResolved ? "Marked" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>

                </article>

                {latest ? (
                  <p className="coach-feedback-latest-date">Latest note: {formatFeedbackDate(latest.createdAt)}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <section className="coach-card">
          <div className="coach-empty">
            <div>
              <MessageSquareText color="var(--color-pink)" />
              <p>No feedback sent yet.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CoachFeedbackPage;
