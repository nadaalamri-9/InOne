import { useEffect, useMemo, useState } from "react";
import { Bookmark, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getEmployerCandidates,
  getEmployerDashboardData,
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

function getSearchText(candidate = {}) {
  return [
    candidate.fullName,
    candidate.role,
    candidate.headline,
    candidate.location,
    ...(candidate.skills || []),
    ...(candidate.targetRoles || []),
    candidate.featuredProject?.title,
    candidate.featuredProject?.summary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getPrimaryProject(candidate = {}) {
  return candidate.featuredProject || candidate.projects?.[0] || null;
}

function uniqueSorted(values = []) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function getSpecialization(candidate = {}) {
  const text = getSearchText(candidate);

  if (text.includes("frontend") || text.includes("react") || text.includes("web")) return "Web Development";
  if (text.includes("machine learning") || text.includes("ml ") || text.includes("tensorflow") || text.includes("pytorch") || text.includes("ai")) return "AI / Machine Learning";
  if (text.includes("data") || text.includes("sql") || text.includes("analytics") || text.includes("dashboard") || text.includes("power bi")) return "Data Science";
  if (text.includes("backend") || text.includes("fastapi") || text.includes("api")) return "Backend Development";

  return candidate.role || "General";
}

function getFilterOptions(candidates = []) {
  return {
    roles: uniqueSorted(candidates.flatMap((candidate) => [
      candidate.role,
      ...(candidate.targetRoles || []),
    ])),
    skills: uniqueSorted(candidates.flatMap((candidate) => candidate.skills || [])),
    specializations: uniqueSorted(candidates.map(getSpecialization)),
  };
}

function isSaved(savedIds = [], id) {
  return savedIds.some((savedId) => String(savedId) === String(id));
}

function EmployerCandidatesPage() {
  const [data, setData] = useState({ candidates: [], savedIds: [], stats: {} });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [specializationFilter, setSpecializationFilter] = useState("All Specializations");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([getEmployerCandidates(), getEmployerDashboardData()]).then(
      ([candidates, dashboardData]) => {
        setData({ candidates, savedIds: dashboardData.savedIds || [], stats: dashboardData.stats || {} });
      }
    );
  }, []);

  const filterOptions = useMemo(() => getFilterOptions(data.candidates || []), [data.candidates]);

  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (data.candidates || []).filter((candidate) => {
      const candidateText = getSearchText(candidate);
      const candidateRoles = [candidate.role, ...(candidate.targetRoles || [])]
        .filter(Boolean)
        .map((role) => String(role).toLowerCase());

      const matchesSearch = !term || candidateText.includes(term);
      const matchesRole =
        roleFilter === "All Roles" ||
        candidateRoles.includes(roleFilter.toLowerCase());

      const matchesSkill =
        skillFilter === "All Skills" ||
        (candidate.skills || []).some((skill) => String(skill).toLowerCase() === skillFilter.toLowerCase());

      const matchesSpecialization =
        specializationFilter === "All Specializations" ||
        getSpecialization(candidate).toLowerCase() === specializationFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesSkill && matchesSpecialization;
    });
  }, [data.candidates, search, roleFilter, skillFilter, specializationFilter]);

  async function handleToggleSave(id) {
    const currentSavedIds = data.savedIds || [];
    const isAlreadySaved = isSaved(currentSavedIds, id);
    const candidate = (data.candidates || []).find((item) => String(item.id) === String(id));

    try {
      if (isAlreadySaved) {
        await unsavePortfolio(id);
        setData((prev) => ({ ...prev, savedIds: (prev.savedIds || []).filter((item) => String(item) !== String(id)) }));
      } else {
        await savePortfolio(id);
        setData((prev) => ({ ...prev, savedIds: [...(prev.savedIds || []), id] }));
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

  return (
    <div className="employer-page">
      <header className="employer-page-header employer-find-page-header">
        <div className="employer-page-heading">
          <h1>Find Candidates</h1>
          <p>Search and filter through top InOne student portfolios.</p>
        </div>
      </header>

      <section className="employer-find-toolbar employer-find-toolbar-restored" aria-label="Candidate search and filters">
        <label className="employer-find-search-input employer-find-search-input-compact employer-find-dashboard-search">
          <Search aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, roles, skills"
          />
        </label>

        <label className="employer-filter-control">
          <span>Roles</span>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option>All Roles</option>
            {filterOptions.roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <SlidersHorizontal className="employer-filter-select-icon" aria-hidden="true" />
        </label>

        <label className="employer-filter-control">
          <span>Skills</span>
          <select value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)}>
            <option>All Skills</option>
            {filterOptions.skills.map((skill) => (
              <option key={skill}>{skill}</option>
            ))}
          </select>
          <SlidersHorizontal className="employer-filter-select-icon" aria-hidden="true" />
        </label>

        <label className="employer-filter-control employer-filter-control-wide">
          <span>Specialization</span>
          <select value={specializationFilter} onChange={(event) => setSpecializationFilter(event.target.value)}>
            <option>All Specializations</option>
            {filterOptions.specializations.map((specialization) => (
              <option key={specialization}>{specialization}</option>
            ))}
          </select>
          <SlidersHorizontal className="employer-filter-select-icon" aria-hidden="true" />
        </label>
      </section>

      {candidates.length ? (
        <section className="employer-portfolio-grid">
          {candidates.map((candidate) => {
            const saved = isSaved(data.savedIds || [], candidate.id);
            const project = getPrimaryProject(candidate);

            return (
              <article className="employer-portfolio-card" key={candidate.id}>
                <div className="employer-portfolio-card-top">
                  <div className="employer-avatar employer-portfolio-avatar">
                    {candidate.photoUrl ? <img src={candidate.photoUrl} alt="" /> : getInitials(candidate.fullName)}
                  </div>

                  <div>
                    <h3>{candidate.fullName}</h3>
                    <p>{candidate.headline}</p>
                  </div>

                  <span className="employer-status-pill">{candidate.status}</span>
                </div>

                {project ? (
                  <div className="employer-portfolio-project">
                    <span>Student project</span>
                    <strong>{project.title}</strong>
                    <p>{project.summary || "Student portfolio project"}</p>
                  </div>
                ) : null}

                <div className="employer-portfolio-meta">
                  <span>{candidate.projectCount || 0} projects</span>
                  <span>{candidate.location}</span>
                </div>

                <div className="employer-tags employer-portfolio-tags">
                  {(candidate.skills || []).slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}
                </div>

                {(candidate.targetRoles || []).length ? (
                  <div className="employer-target-roles">
                    {(candidate.targetRoles || []).slice(0, 3).map((role) => <span key={role}>{role}</span>)}
                  </div>
                ) : null}

                <div className="employer-card-actions employer-portfolio-actions">
                  <button
                    type="button"
                    className={`employer-soft-btn employer-save-candidate-btn ${saved ? "employer-save-candidate-btn-saved" : ""}`}
                    onClick={() => handleToggleSave(candidate.id)}
                  >
                    <Bookmark size={14} />
                    {saved ? "Saved" : "Save"}
                  </button>
                  <Link className="employer-primary-btn" to={candidate.portfolioUrl}>
                    View portfolio
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="employer-empty">No students found.</section>
      )}

      <ToastMessage toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default EmployerCandidatesPage;
