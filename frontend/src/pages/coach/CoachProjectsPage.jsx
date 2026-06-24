import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FolderKanban, MessageSquareText, RefreshCcw, Search } from "lucide-react";
import { getCoachProjects } from "./coachApi";
function normalizeStatusKey(value) {
  return String(value || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeStatusClass(statusLabel, status) {
  return (
    String(statusLabel || status || "")
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-") || "draft"
  );
}

function formatProjectUpdate(value) {
  if (!value) return "Not updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getProjectAction(project) {
  const status = normalizeStatusKey(project.status || project.statusLabel);

  if (status === "published" || status === "publish") {
    return {
      label: "View",
      path: `/coach/projects/${project.id}?mode=view`,
    };
  }

  if (status === "needs_revision") {
    return {
      label: "Give feedback",
      path: `/coach/projects/${project.id}`,
    };
  }

  return null;
}

function CoachProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCoachProjects().then(setProjects);
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) =>
      [project.title, project.summary, project.studentName, project.statusLabel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [projects, search]);

  return (
    <div className="coach-page">
      <header className="coach-page-header">
        <div className="coach-page-heading">
          <h1>Students project</h1>
          <p>Open a student project and send section-based feedback.</p>
        </div>
        <div className="coach-header-actions">
          <label className="coach-search-box">
            <Search aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
            />
          </label>
        </div>
      </header>

      <section className="coach-grid-3" aria-label="Project review stats">
        <article className="coach-stat-card"><div className="coach-stat-icon"><FolderKanban /></div><div><p>Projects</p><strong>{projects.length}</strong></div></article>
        <article className="coach-stat-card"><div className="coach-stat-icon"><MessageSquareText /></div><div><p>Feedback Items</p><strong>{projects.reduce((sum, project) => sum + project.feedbackCount, 0)}</strong></div></article>
        <article className="coach-stat-card"><div className="coach-stat-icon"><RefreshCcw /></div><div><p>Needs Revision</p><strong>{projects.filter((project) => project.status === "needs_revision").length}</strong></div></article>
      </section>

      <section className="coach-card coach-projects-table-card">
        <div className="coach-projects-table-header">
          <h2>Student projects</h2>
          <button
            type="button"
            className="coach-projects-view-all"
            onClick={() => navigate("/coach/feedback")}
          >
            View
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div className="coach-projects-table" role="table" aria-label="Coach student projects">
          <div className="coach-projects-table-row coach-projects-table-head" role="row">
            <span>Project</span>
            <span>Student</span>
            <span>Status</span>
            <span>Last update</span>
            <span>Action</span>
          </div>

          {filteredProjects.map((project) => {
            const action = getProjectAction(project);
            const statusClass = normalizeStatusClass(project.statusLabel, project.status);

            return (
              <div key={project.id} className="coach-projects-table-row" role="row">
                <strong>{project.title || "Untitled project"}</strong>
                <span>{project.studentName || "Student"}</span>
                <span className={`coach-status-pill coach-status-${statusClass}`}>
                  {project.statusLabel || "Draft"}
                </span>
                <span>{formatProjectUpdate(project.updatedAt || project.updated_at)}</span>
                {action ? (
                  <button
                    type="button"
                    className="coach-row-view-button"
                    onClick={() => navigate(action.path)}
                  >
                    {action.label}
                    <ArrowRight aria-hidden="true" />
                  </button>
                ) : (
                  <span className="coach-row-no-action" aria-hidden="true"></span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default CoachProjectsPage;
