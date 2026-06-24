import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import portfolioHero from "../../assets/portfolio-hero.svg";
import { apiFetch, mediaUrl } from "../../services/api";

async function getPublicPortfolios() {
  try {
    const data = await apiFetch("/portfolio/public");
    if (!Array.isArray(data)) return [];
    return data.map((candidate) => ({
      ...candidate,
      photoUrl: mediaUrl(candidate.photoUrl || candidate.photo_url || ""),
    }));
  } catch {
    return [];
  }
}
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
  if (text.includes("backend") || text.includes("fastapi") || text.includes("api")) return "Backnd Development";

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

export default function Portfolios() {
  const navigate = useNavigate();
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [specializationFilter, setSpecializationFilter] = useState("All Specializations");

  useEffect(() => {
    getPublicPortfolios().then(setAllPortfolios);
  }, []);

  const filterOptions = useMemo(() => getFilterOptions(allPortfolios), [allPortfolios]);

  const portfolios = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allPortfolios.filter((candidate) => {
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
  }, [allPortfolios, search, roleFilter, skillFilter, specializationFilter]);

  return (
    <>
      

      <main className="portfolios-page">
        <section className="portfolios-hero-section">
          <div className="portfolios-topbar">
            <a href="/" className="portfolios-logo">
              <img src="/logo.svg" alt="InOne" />
            </a>
            <button
              className="auth-home-btn"
              type="button"
              onClick={() => navigate("/")}>
              <ArrowLeft size={18} />
              Back
            </button>
            
          </div>
          <div className="portfolios-hero-content">
            <h1>
              Explore
              <br />
              <span className="portfolios-gradient-word"> Portfolios</span>
            </h1>

            <p className="portfolios-hero-text">
              Browse organized student portfolios, project cards, skills, resumes,
              and achievements in one clean InOne experience.
            </p>

            <Button
              size="lg"
              className="portfolios-home-btn"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={18} />
              Home
            </Button>
          </div>

          <div className="portfolios-hero-visual" aria-hidden="true">
            <img src={portfolioHero} alt="" />
          </div>
        </section>

        <section className="portfolios-cards-section">
          <div className="container portfolios-cards-inner portfolios-showcase">
            <div className="portfolios-section-heading">
              <span>
                <Sparkles size={14} />
                PORTFOLIOS
              </span>
              <h2>Explore student portfolios</h2>
              <p>
                Employer-style cards that highlight each student, featured project,
                skills, target roles, and portfolio link.
              </p>
            </div>

            <section
              className="employer-find-toolbar employer-find-toolbar-restored portfolios-filter-toolbar"
              aria-label="Portfolio search and filters"
            >
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
                <select
                  value={specializationFilter}
                  onChange={(event) => setSpecializationFilter(event.target.value)}
                >
                  <option>All Specializations</option>
                  {filterOptions.specializations.map((specialization) => (
                    <option key={specialization}>{specialization}</option>
                  ))}
                </select>
                <SlidersHorizontal className="employer-filter-select-icon" aria-hidden="true" />
              </label>
            </section>

            {portfolios.length ? (
              <div className="employer-portfolio-grid portfolios-employer-grid">
                {portfolios.map((candidate) => {
                  const project = getPrimaryProject(candidate);

                  return (
                    <article className="employer-portfolio-card" key={candidate.id}>
                      <div className="employer-portfolio-card-top">
                        <div className="employer-avatar employer-portfolio-avatar">
                          {candidate.photoUrl ? (
                            <img src={candidate.photoUrl} alt="" />
                          ) : (
                            getInitials(candidate.fullName)
                          )}
                        </div>

                        <div>
                          <h3>{candidate.fullName}</h3>
                          <p>{candidate.headline || candidate.role || "Student portfolio"}</p>
                        </div>

                        <span className="employer-status-pill">{candidate.status || "Public"}</span>
                      </div>

                      {project ? (
                        <div className="employer-portfolio-project">
                          <span>Featured project</span>
                          <strong>{project.title}</strong>
                          <p>{project.summary || "Student portfolio project"}</p>
                        </div>
                      ) : (
                        <div className="employer-portfolio-project">
                          <span>Featured project</span>
                          <strong>Portfolio overview</strong>
                          <p>View this student portfolio to explore profile details and skills.</p>
                        </div>
                      )}

                      <div className="employer-portfolio-meta">
                        <span>{candidate.projectCount || 0} projects</span>
                        <span>{candidate.location || "Location not added"}</span>
                      </div>

                      <div className="employer-tags employer-portfolio-tags">
                        {(candidate.skills || []).slice(0, 4).map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>

                      {(candidate.targetRoles || []).length ? (
                        <div className="employer-target-roles">
                          {(candidate.targetRoles || []).slice(0, 3).map((role) => (
                            <span key={role}>{role}</span>
                          ))}
                        </div>
                      ) : null}

                      <div className="employer-card-actions employer-portfolio-actions">
                        <Link className="employer-primary-btn" to={candidate.portfolioUrl}>
                          View portfolio
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <section className="portfolios-empty-state">No portfolios found.</section>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
