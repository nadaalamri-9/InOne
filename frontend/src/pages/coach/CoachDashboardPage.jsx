import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  FolderKanban,
  MessageSquareText,
  RefreshCcw,
  Star,
} from "lucide-react";
import { getCoachDashboardData, getEmployeeOfTheMonthForRole } from "./coachApi";

function StatCard({ icon: Icon, title, value }) {
  return (
    <article className="coach-stat-card">
      <div className="coach-stat-icon">
        <Icon aria-hidden="true" />
      </div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function normalizeStatusKey(status) {
  const text = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (text === "published" || text === "public") return "published";

  if (
    text === "needs_revision" ||
    text === "needs_review" ||
    text === "under_review" ||
    text === "in_review" ||
    text === "review"
  ) {
    return "needsRevision";
  }

  if (
    text === "ready" ||
    text === "completed" ||
    text === "complete" ||
    text === "approved" ||
    text === "in_progress" ||
    text === "draft" ||
    text === "pending" ||
    text === "submitted" ||
    !text
  ) {
    return "ready";
  }

  return "ready";
}

function getLabels(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.name || item?.title || item?.label || item?.skill || "";
    })
    .map((label) => String(label).trim())
    .filter(Boolean);
}

function getProjectSkillLabels(project) {
  const skills = getLabels(project.skills);
  const tools = getLabels(project.tools);
  return [...new Set([...skills, ...tools])];
}

function getTopSkills(projects = []) {
  const counts = new Map();

  projects.forEach((project) => {
    getProjectSkillLabels(project).forEach((skill) => {
      counts.set(skill, (counts.get(skill) || 0) + 1);
    });
  });

  const maxCount = Math.max(1, ...counts.values());

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.max(8, Math.round((count / maxCount) * 100)),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 4);
}

function getStatusAnalytics(projects = []) {
  const counts = {
    published: 0,
    ready: 0,
    needsRevision: 0,
    draft: 0,
  };

  projects.forEach((project) => {
    counts[normalizeStatusKey(project.status)] += 1;
  });

  const total = counts.published + counts.ready + counts.needsRevision;
  const publishedDeg = total ? Math.round((counts.published / total) * 360) : 0;
  const readyDeg =
    publishedDeg + (total ? Math.round((counts.ready / total) * 360) : 0);
  const needsRevisionDeg =
    readyDeg + (total ? Math.round((counts.needsRevision / total) * 360) : 0);

  return { counts, total, publishedDeg, readyDeg, needsRevisionDeg };
}

function getImageUrl(src = "") {
  if (!src) return "";
  return src.startsWith("http") ? src : `http://127.0.0.1:8000${src}`;
}

function TopSkillsCard({ skills }) {
  return (
    <section className="coach-analytics-card coach-score-like-card coach-top-skills-card">
      <div className="coach-score-like-header">
        <h2>Top Skills</h2>
      </div>

      <div className="coach-score-divider" />

      {skills.length ? (
        <div className="coach-skill-bars coach-score-skill-list">
          {skills.map((skill) => (
            <div className="coach-skill-row" key={skill.name}>
              <span>{skill.name}</span>
              <div className="coach-skill-track">
                <i style={{ width: `${skill.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="coach-analytics-empty">No skills added yet.</div>
      )}
    </section>
  );
}

function ProjectsStatusCard({ analytics }) {
  const { counts, total, publishedDeg, readyDeg, needsRevisionDeg } = analytics;

  return (
    <section className="coach-analytics-card coach-score-like-card coach-status-card">
      <div className="coach-score-like-header">
        <h2>Projects Status</h2>
      </div>

      <div className="coach-score-divider" />

      <div className="coach-status-chart-layout">
        <div
          className="coach-status-donut"
          style={{
            "--published-deg": `${publishedDeg}deg`,
            "--ready-deg": `${readyDeg}deg`,
            "--needs-revision-deg": `${needsRevisionDeg}deg`,
          }}
        >
          <span>{total}</span>
        </div>

        <div className="coach-status-legend">
          <span>
            <i className="coach-dot-published" /> Published <b>{counts.published}</b>
          </span>
          <span>
            <i className="coach-dot-ready" /> Ready <b>{counts.ready}</b>
          </span>
          <span>
            <i className="coach-dot-needs" /> Needs Revision <b>{counts.needsRevision}</b>
          </span>
        </div>
      </div>
    </section>
  );
}

function CoachDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    stats: {},
    projects: [],
    feedback: [],
    employeeOfTheMonth: null,
  });

  useEffect(() => {
    function loadDashboard() {
      getCoachDashboardData().then((payload) => {
        setData({
          ...payload,
          employeeOfTheMonth: getEmployeeOfTheMonthForRole("Career Coach"),
        });
      });
    }

    loadDashboard();
    window.addEventListener("inone-admin-data-updated", loadDashboard);
    window.addEventListener("storage", loadDashboard);

    return () => {
      window.removeEventListener("inone-admin-data-updated", loadDashboard);
      window.removeEventListener("storage", loadDashboard);
    };
  }, []);

  const topSkills = useMemo(() => getTopSkills(data.projects || []), [data.projects]);
  const statusAnalytics = useMemo(
    () => getStatusAnalytics(data.projects || []),
    [data.projects]
  );
  const employeeOfTheMonth = data.employeeOfTheMonth;

  return (
    <div className="coach-page">
      <header className="coach-page-header">
        <div className="coach-page-heading">
          <h1>My Dashboard</h1>
          <p>Review student projects, send feedback, and track portfolio progress.</p>
        </div>
      </header>

      <section className="coach-grid-4" aria-label="Coach overview stats">
        <StatCard icon={FolderKanban} title="Projects" value={data.stats.projects || 0} />
        <StatCard icon={RefreshCcw} title="Needs Revision" value={data.stats.needsRevision || 0} />
        <StatCard icon={MessageSquareText} title="Feedback Sent" value={data.stats.feedback || 0} />
        <StatCard icon={FileText} title="Published" value={data.stats.published || 0} />
      </section>

      <div className="coach-two-column coach-dashboard-columns">
        <div className="coach-dashboard-column">
          <section className="coach-card">
            <div className="coach-card-header">
              <div>
                <h2>Recent projects</h2>
              </div>
              <button
                type="button"
                className="coach-dashboard-arrow-link"
                onClick={() => navigate("/coach/projects")}
              >
                View
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <div className="coach-list">
              {data.projects.slice(0, 4).map((project) => (
                <article key={project.id} className="coach-project-card coach-project-card-static">
                  <div>
                    <h3>{project.title || "Untitled project"}</h3>
                    <p>{project.summary || project.overview || "No summary added yet."}</p>
                    <div className="coach-meta-row">
                      <span
                        className={`coach-status-pill coach-status-${project.statusLabel
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {project.statusLabel}
                      </span>
                      <span className="coach-meta-chip">{project.studentName}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <TopSkillsCard skills={topSkills} />
        </div>

        <div className="coach-dashboard-column coach-dashboard-right-column">
          {employeeOfTheMonth ? (
            <section className="coach-employee-month-card">
              <div className="coach-employee-month-avatar">
                {employeeOfTheMonth.avatar ? (
                  <img src={getImageUrl(employeeOfTheMonth.avatar)} alt="" />
                ) : (
                  <span>{String(employeeOfTheMonth.name || "E").charAt(0)}</span>
                )}
              </div>

              <div>
                <p>Employee of the Month</p>
                <h2>{employeeOfTheMonth.name}</h2>
                <div className="coach-employee-month-stars" aria-hidden="true">
  {[...Array(5)].map((_, i) => (
    <Star key={i} fill="currentColor" />
  ))}
</div>
                <span>Selected by Admin</span>
              </div>
            </section>
          ) : null}

          <section className="coach-card">
            <div className="coach-card-header">
              <div>
                <h2>Latest feedback</h2>
              </div>
              <button
                type="button"
                className="coach-dashboard-arrow-link coach-latest-feedback-open"
                onClick={() => navigate("/coach/feedback")}
                aria-label="Open latest feedback"
              >
                Open
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <div className="coach-list">
              {data.feedback.slice(0, 4).map((item) => (
                <article
                  key={item.id || `${item.projectId}-${item.createdAt}`}
                  className="coach-feedback-row"
                >
                  <div className="coach-avatar">
                    {String(item.studentName || "S").charAt(0)}
                  </div>
                  <div className="coach-feedback-content">
                    <h3>{item.projectTitle}</h3>
                    <p>{item.message || item.comment}</p>
                    <div className="coach-meta-row">
                      <span className="coach-meta-chip">
                        {item.section || "Project summary"}
                      </span>
                      <span className="coach-meta-chip">{item.studentName}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ProjectsStatusCard analytics={statusAnalytics} />
        </div>
      </div>
    </div>
  );
}

export default CoachDashboardPage;
