import { ArrowRight, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatDashboardDate,
  normalizeDashboardStatus,
} from "../utils/portfolioScore";
const PROJECT_STATUS_COUNTS = [
  { key: "draft", label: "Draft" },
  { key: "needs_revision", label: "Needs Revision" },
  { key: "ready", label: "Ready" },
  { key: "published", label: "Published" },
];

function getStatusLabel(status) {
  const value = normalizeDashboardStatus(status);
  const labels = {
    draft: "Draft",
    needs_revision: "Needs Revision",
    ready: "Ready",
    published: "Published",
    in_progress: "In Progress",
  };

  return labels[value] || "Draft";
}

function getStack(project) {
  const tools = Array.isArray(project.tools) ? project.tools : [];
  const skills = Array.isArray(project.skills) ? project.skills : [];

  const names = [...tools, ...skills]
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);

  return [...new Set(names)].slice(0, 3).join(", ") || "No stack yet";
}

function ProjectsOverviewCard({ projects, statusCounts }) {
  return (
    <section className="dashboard-projects-card">
      <div className="dashboard-card-header">
        <h2>My Projects</h2>
        <Link to="/project" className="dashboard-view-link">
          View
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="dashboard-project-count-row" aria-label="Project status counts">
        {PROJECT_STATUS_COUNTS.map((item) => (
          <div key={item.key} className={`dashboard-project-count count-${item.key}`}>
            <span>{item.label}</span>
            <strong>{statusCounts?.[item.key] || 0}</strong>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="dashboard-projects-empty">
          <FolderKanban aria-hidden="true" />
          <p>No projects yet</p>
          <span>Create your first portfolio project</span>
        </div>
      ) : (
        <div className="dashboard-project-table-wrap">
          <table className="dashboard-project-table">
            <colgroup>
              <col className="project-title-column" />
              <col className="project-status-column" />
              <col className="project-stack-column" />
              <col className="project-date-column" />
            </colgroup>
            <thead>
              <tr>
                <th className="project-title-cell">Project</th>
                <th>Status</th>
                <th>Stack</th>
                <th className="project-date-cell">Last update</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const status = normalizeDashboardStatus(project.status);

                return (
                  <tr key={project.id} className={`dashboard-project-row row-${status}`}>
                    <td className="project-title-cell">
                      {project.title || "Untitled project"}
                    </td>
                    <td>
                      <span className={`dashboard-status-badge status-${status}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="project-stack-cell">{getStack(project)}</td>
                    <td className="project-date-cell">
                      {formatDashboardDate(project.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProjectsOverviewCard;
