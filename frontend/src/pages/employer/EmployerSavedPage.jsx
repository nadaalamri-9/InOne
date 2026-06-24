import { useEffect, useMemo, useState } from "react";
import { Bookmark, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getEmployerSaved,
  unsavePortfolio,
} from "./employerApi";
import ToastMessage from "../../components/ToastMessage";
function getInitials(name) {
  return (
    String(name || "Student")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S"
  );
}

function getPrimaryProject(candidate = {}) {
  return candidate.featuredProject || candidate.projects?.[0] || null;
}

function getProjectStatusLabel(status) {
  const text = String(status || "published").replace(/[_-]+/g, " ").trim();
  if (!text) return "Published";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatSavedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Saved date not available";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysAgo(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function matchesSavedDateFilter(savedAt, filter) {
  const daysAgo = getDaysAgo(savedAt);

  if (filter === "today") return daysAgo >= 0 && daysAgo < 1;
  if (filter === "last7") return daysAgo >= 0 && daysAgo <= 7;
  if (filter === "last30") return daysAgo >= 0 && daysAgo <= 30;

  return true;
}


function EmployerSavedPage() {
  const [candidates, setCandidates] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getEmployerSaved().then(setCandidates);
  }, []);

  const savedCandidates = useMemo(() => {
    return candidates
      .filter((candidate) => matchesSavedDateFilter(candidate.savedAt, dateFilter))
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  }, [candidates, dateFilter]);

  async function handleRemoveSaved(id) {
    const candidate = candidates.find((item) => String(item.id) === String(id));

    try {
      await unsavePortfolio(id);
      setCandidates((prev) => prev.filter((item) => String(item.id) !== String(id)));
      setToast({
        type: "success",
        text: `${candidate?.fullName || "Candidate"} removed from saved candidates.`,
      });
    } catch {
      setToast({ type: "error", text: "Failed to remove saved candidate." });
    }
  }

  return (
    <div className="employer-page">
      <header className="employer-page-header employer-saved-header">
        <div className="employer-page-heading">
          <h1>Saved Candidates</h1>
          <p>Review the student portfolios you saved as an employer.</p>
        </div>

        <label className="employer-filter-control employer-saved-date-filter employer-saved-filter-pretty employer-saved-filter-like-roles">
          <span>Saved date</span>
          <div className="employer-select-with-icon">
            <SlidersHorizontal aria-hidden="true" />
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              <option value="all">All saved dates</option>
              <option value="today">Saved today</option>
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
            </select>
          </div>
        </label>
      </header>

      {savedCandidates.length ? (
        <section className="employer-portfolio-grid">
          {savedCandidates.map((candidate) => (
            <article className="employer-portfolio-card" key={candidate.id}>
              <div className="employer-portfolio-card-top">
                <div className="employer-avatar employer-portfolio-avatar">
                  {candidate.photoUrl ? <img src={candidate.photoUrl} alt="" /> : getInitials(candidate.fullName)}
                </div>

                <div>
                  <h3>{candidate.fullName}</h3>
                  <p>{candidate.headline}</p>
                </div>

                <span className="employer-status-pill">Saved</span>
              </div>

              <div className="employer-saved-date">
                Saved on {formatSavedDate(candidate.savedAt)}
              </div>

              {(candidate.projects || []).length ? (
                <div className="employer-saved-projects-preview">
                  <span className="employer-saved-projects-label">Student projects</span>
                  {(candidate.projects || []).slice(0, 2).map((project) => (
                    <div className="employer-saved-project-item" key={project.id || project.title}>
                      <div>
                        <strong>{project.title || "Untitled project"}</strong>
                        <p>{project.summary || "Student portfolio project"}</p>
                      </div>
                      <span>{getProjectStatusLabel(project.status || project.statusLabel)}</span>
                    </div>
                  ))}
                </div>
              ) : getPrimaryProject(candidate) ? (
                <div className="employer-portfolio-project">
                  <span>Student project</span>
                  <strong>{getPrimaryProject(candidate).title}</strong>
                  <p>{getPrimaryProject(candidate).summary || "Student portfolio project"}</p>
                </div>
              ) : null}

              <div className="employer-portfolio-meta">
                <span>{candidate.projectCount || 0} projects</span>
                <span>{candidate.location}</span>
              </div>

              <div className="employer-tags employer-portfolio-tags">
                {(candidate.skills || []).slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
              </div>

              <div className="employer-card-actions employer-portfolio-actions">
                <button type="button" className="employer-soft-btn" onClick={() => handleRemoveSaved(candidate.id)}>
                  <Bookmark size={16} />
                  Remove saved
                </button>
                <Link className="employer-primary-btn" to={candidate.portfolioUrl}>
                  View portfolio
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="employer-empty">
          {dateFilter === "all" ? "No saved candidates yet." : "No saved candidates match this saved date filter."}
        </section>
      )}

      <ToastMessage toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default EmployerSavedPage;
