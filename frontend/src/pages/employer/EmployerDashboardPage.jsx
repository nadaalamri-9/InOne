import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  FolderCheck,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getEmployerDashboardData,
  getEmployeeOfTheMonthForRole,
  savePortfolio,
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

function EmployerStatCard({ label, value, icon: Icon }) {
  return (
    <article className="employer-stat-card">
      <span className="employer-stat-icon">
        <Icon aria-hidden="true" />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function hasPublishedProject(candidate = {}) {
  return (candidate.projects || []).some(
    (project) => normalizeStatus(project.status) === "published",
  );
}

function getRecentPublishedDate(candidate = {}) {
  const publishedProjects = (candidate.projects || []).filter(
    (project) => normalizeStatus(project.status) === "published",
  );

  const timestamps = publishedProjects
    .map((project) =>
      new Date(
        project.updatedAt ||
          project.updated_at ||
          project.createdAt ||
          project.created_at ||
          0,
      ).getTime(),
    )
    .filter((value) => Number.isFinite(value) && value > 0);

  return timestamps.length ? Math.max(...timestamps) : 0;
}

function CandidateCard({ candidate, saved, onToggleSave }) {
  return (
    <article className="employer-candidate-card">
      <div className="employer-candidate-top">
        <div className="employer-avatar">
          {candidate.photoUrl ? (
            <img src={candidate.photoUrl} alt="" />
          ) : (
            getInitials(candidate.fullName)
          )}
        </div>

        <div>
          <h3>{candidate.fullName}</h3>
          <p>{candidate.role}</p>
          <p>{candidate.headline}</p>
        </div>

        <span className="employer-status-pill">{candidate.status}</span>
      </div>

      <div className="employer-tags">
        {(candidate.skills || []).slice(0, 5).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      {candidate.featuredProject ? (
        <div className="employer-featured-project">
          <strong>{candidate.featuredProject.title}</strong>
          <p>{candidate.featuredProject.summary}</p>
        </div>
      ) : null}

      <div className="employer-card-actions">
        <button
          type="button"
          className="employer-soft-btn"
          onClick={() => onToggleSave(candidate.id)}
        >
          <Bookmark size={16} />
          {saved ? "Saved" : "Save"}
        </button>

        <Link className="employer-primary-btn" to={candidate.portfolioUrl}>
          View portfolio
        </Link>
      </div>
    </article>
  );
}

function EmployerDashboardPage() {
  const [data, setData] = useState({
    candidates: [],
    savedIds: [],
    stats: {},
    employeeOfTheMonth: null,
  });
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function loadDashboard() {
      getEmployerDashboardData().then((payload) => {
        setData({
          ...payload,
          employeeOfTheMonth: getEmployeeOfTheMonthForRole("Employer"),
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

  const savedIds = data.savedIds || [];
  const employeeOfTheMonth = data.employeeOfTheMonth;

  const filteredCandidates = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return data.candidates || [];

    return (data.candidates || []).filter((candidate) => {
      const haystack = [
        candidate.fullName,
        candidate.role,
        candidate.headline,
        candidate.location,
        ...(candidate.skills || []),
        ...(candidate.targetRoles || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [data.candidates, search]);

  async function handleToggleSave(id) {
    const isAlreadySaved = savedIds.some((item) => String(item) === String(id));
    const candidate = (data.candidates || []).find(
      (item) => String(item.id) === String(id),
    );

    try {
      if (isAlreadySaved) {
        await unsavePortfolio(id);
        setData((prev) => ({
          ...prev,
          savedIds: (prev.savedIds || []).filter(
            (item) => String(item) !== String(id),
          ),
        }));
      } else {
        await savePortfolio(id);
        setData((prev) => ({
          ...prev,
          savedIds: [...(prev.savedIds || []), id],
        }));
      }

      setToast({
        type: "success",
        text: isAlreadySaved
          ? `${candidate?.fullName || "Candidate"} removed from saved candidates.`
          : `${candidate?.fullName || "Candidate"} saved successfully.`,
      });
    } catch {
      setToast({ type: "error", text: "Failed to update saved candidates." });
    }
  }

  const stats = [
    {
      label: "Total Students",
      value: data.stats?.totalStudents || 0,
      icon: Users,
    },
    { label: "Saved Portfolios", value: savedIds.length, icon: Bookmark },
    {
      label: "Published Projects",
      value: data.stats?.publishedProjects || 0,
      icon: FolderCheck,
    },
  ];

  return (
    <div className="employer-page">
      <header className="employer-page-header">
        <div className="employer-page-heading">
          <h1>My Dashboard</h1>
          <p>
            Browse student portfolios, save strong candidates, and open shared
            work.
          </p>
        </div>

        <label className="employer-search-box">
          <Search aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by skills or target roles"
          />
        </label>
      </header>

      <section className="employer-stats-grid" aria-label="Employer statistics">
        {stats.map((stat) => (
          <EmployerStatCard key={stat.label} {...stat} />
        ))}
      </section>

      {employeeOfTheMonth ? (
        <section className="employer-employee-month-card">
          <div className="employer-employee-month-avatar">
            {employeeOfTheMonth.avatar ? (
              <img
                src={
                  employeeOfTheMonth.avatar.startsWith("http")
                    ? employeeOfTheMonth.avatar
                    : `http://127.0.0.1:8000${employeeOfTheMonth.avatar}`
                }
                alt=""
              />
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

      <section className="employer-card">
        <div className="employer-card-header">
          <div>
            <h2>Recent published student portfolios</h2>
          </div>
          <Link className="employer-arrow-link" to="/employer/candidates">
            View
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="employer-candidates-grid">
          {filteredCandidates
            .filter(hasPublishedProject)
            .sort(
              (a, b) => getRecentPublishedDate(b) - getRecentPublishedDate(a),
            )
            .slice(0, 6)
            .map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                saved={savedIds.includes(candidate.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
        </div>
      </section>

      <ToastMessage toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default EmployerDashboardPage;
