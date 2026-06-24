import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Code2,
  Eye,
  ImagePlus,
  Layers3,
  ListChecks,
  MonitorPlay,
  Network,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";

import ProfilePic from "../../../../assets/ProfilePic.svg";
import GitHubIcon from "../../../../assets/GitHub.svg";
import ProjectShell from "./ProjectViewPage/components/ProjectShell";
import ProjectViewSkillsSection from "./ProjectViewPage/components/ProjectViewSkillsSection";
import { getProjectById } from "../services/projectApi";
import { checkProjectContent } from "../../../../services/aiApi";
function getItemName(item) {
  if (typeof item === "string") return item;
  return item?.name || item?.title || item?.label || "";
}

function normalizeList(items) {
  return (Array.isArray(items) ? items : []).map(getItemName).filter(Boolean);
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
}

function getProjectImage(project = {}) {
  const firstScreenshot = Array.isArray(project.screenshots) ? project.screenshots[0] : null;

  if (typeof firstScreenshot === "string") return firstScreenshot;
  if (firstScreenshot) {
    return firstScreenshot.preview || firstScreenshot.url || firstScreenshot.dataUrl || "";
  }

  return project.imageUrl || project.coverImage || project.thumbnail || "";
}

function getScreenshotImages(project = {}) {
  return (Array.isArray(project.screenshots) ? project.screenshots : [])
    .map((screenshot) => {
      if (typeof screenshot === "string") return screenshot;
      return screenshot.preview || screenshot.url || screenshot.dataUrl || "";
    })
    .filter(Boolean);
}

function isTextReady(value) {
  return Boolean(String(value || "").trim());
}

function scoreText(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "—";
  return `${Math.max(0, Math.min(100, Math.round(number)))}%`;
}

function likelihoodLabel(value) {
  const text = String(value || "low").trim().toLowerCase();
  if (text === "high") return "High AI likelihood";
  if (text === "medium") return "Medium AI likelihood";
  return "Low AI likelihood";
}


function ProjectTextBlock({ icon: Icon, title, children, emptyText, className = "", id }) {
  const hasContent = isTextReady(children);

  return (
    <section id={id} className={`project-view-card project-view-detail-card ${className}`}>
      <div className="project-view-card-title">
        <span className="project-view-section-icon">
          <Icon size={22} />
        </span>
        <h2>{title}</h2>
      </div>

      <p className={hasContent ? "project-view-text" : "project-view-empty-text"}>
        {hasContent ? children : emptyText}
      </p>
    </section>
  );
}

export function ProjectViewContent({ project, isPublicView, backTo }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const skills = uniqueList(normalizeList(project.skills));
  const tools = uniqueList(normalizeList(project.tools));
  const features = normalizeList(project.features);
  const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
  const screenshots = getScreenshotImages(project);
  const coverImage = getProjectImage(project);
  const isSoloProject = Boolean(project.isSoloProject) || teamMembers.length === 0;
  const hasGithub = isTextReady(project.githubUrl);
  const hasDemo = isTextReady(project.demoUrl);
  const hasProject = project?.id || isTextReady(project?.title);

  const backTarget = backTo || (isPublicView ? "/portfolio#projects" : "/project");

  async function handleInlineAiCheck() {
    setIsAiOpen(true);
    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      if (!project?.id) {
        throw new Error("Save the project first, then run the AI check.");
      }

      const result = await checkProjectContent(project.id, project);
      setAiResult(result);
    } catch (error) {
      setAiError(error?.message || "Something went wrong while checking this project.");
    } finally {
      setAiLoading(false);
    }
  }


  if (!hasProject) {
    return (
      <div className="project-view-page">
        <section className="project-view-card project-view-not-found">
          <span className="project-view-section-icon">
            <Eye size={26} />
          </span>
          <h1>Project not found</h1>
          <p>This project may have been deleted or is not available.</p>
          <Link to={backTarget} className="project-view-primary-link">
            <ArrowLeft size={18} />
            Back to projects
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="project-view-page">
      <header className="project-view-hero">
        <div className="project-view-hero-copy">

          <h1>{project.title || "Untitled project"}</h1>
          <p className="project-view-summary">
            {project.summary || project.overview || "No project summary yet."}
          </p>

          <div className="project-view-actions">
            {hasDemo && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-view-gradient-btn">
                <MonitorPlay size={18} />
                View demo
              </a>
            )}

            {hasGithub && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-view-gradient-btn">
                <img src={GitHubIcon} alt="" className="project-view-action-img" />
                GitHub
              </a>
            )}

            {!isPublicView && (
              <button
                type="button"
                className="project-view-gradient-btn project-view-ai-btn"
                onClick={handleInlineAiCheck}
              >
                <Sparkles size={18} />
                AI Check
              </button>
            )}
          </div>

          <div className="project-view-hero-info-row">
            <div className="project-view-hero-info-box">
              <CalendarDays size={24} />
              <div>
                <span>Duration</span>
                <strong>{project.duration || "No duration yet"}</strong>
              </div>
            </div>

            <div className="project-view-hero-info-box">
              <Target size={24} />
              <div>
                <span>My role</span>
                <strong>{project.role || "No role yet"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="project-view-cover-card">
          {coverImage ? (
            <img src={coverImage} alt={`${project.title || "Project"} screenshot`} />
          ) : (
            <div className="project-view-cover-placeholder">
              <Code2 size={52} />
              <span>No project image yet</span>
            </div>
          )}
        </div>
      </header>


      <div className="project-view-content-columns">
        <div className="project-view-left-column">
          <ProjectTextBlock
            id="overview"
            icon={Layers3}
            title="Overview"
            emptyText="No project overview yet."
          >
            {project.overview}
          </ProjectTextBlock>

          <ProjectTextBlock
            icon={Target}
            title="Problem"
            emptyText="No problem statement yet."
          >
            {project.businessProblem || project.problem}
          </ProjectTextBlock>

          <ProjectTextBlock
            icon={Network}
            title="Solution"
            emptyText="No solution details yet."
          >
            {project.solution}
          </ProjectTextBlock>

          <ProjectTextBlock
            icon={Layers3}
            title="Architecture"
            emptyText="No architecture details yet."
          >
            {project.architecture}
          </ProjectTextBlock>

          <ProjectTextBlock
            icon={Trophy}
            title="Results"
            emptyText="No results added yet."
          >
            {project.results}
          </ProjectTextBlock>

      <section id="screenshots" className="project-view-card project-view-gallery-card">
        <div className="project-view-card-title">
          <span className="project-view-section-icon">
            <ImagePlus size={22} />
          </span>
          <h2>Screenshots</h2>
        </div>

        {screenshots.length ? (
          <div className="project-view-gallery-grid">
            {screenshots.slice(0, 6).map((screenshot, index) => (
              <img key={`${screenshot}-${index}`} src={screenshot} alt={`Project screenshot ${index + 1}`} />
            ))}
          </div>
        ) : (
          <div className="project-view-soft-empty">No screenshots yet</div>
        )}
      </section>
        </div>

        <aside className="project-view-right-column">
          <section id="team" className="project-view-card project-view-list-card">
            <div className="project-view-card-title">
              <span className="project-view-section-icon">
                <UsersRound size={22} />
              </span>
              <h2>Team</h2>
            </div>

            {isSoloProject ? (
              <div className="project-view-solo-box">
                <CheckCircle2 size={22} />
                <span>Solo project</span>
              </div>
            ) : (
              <div className="project-view-members-list">
                {teamMembers.map((member, index) => {
                  const memberPhoto =
                    member.avatar ||
                    member.photoPreview ||
                    member.photoUrl ||
                    member.profileImage ||
                    member.imageUrl ||
                    member.image ||
                    member.picture ||
                    ProfilePic;

                  const memberInner = (
                    <>
                      <img src={memberPhoto} alt="" />
                      <div>
                        <strong>{member.name || "Team member"}</strong>
                        <span>{member.email || member.role || "Project teammate"}</span>
                      </div>
                    </>
                  );

                  // Linked teammates open their portfolio (which shows the
                  // "private" gate if their portfolio is private). We link by
                  // userId, or fall back to email for members added by email.
                  const memberId = member.userId || member.email;

                  return memberId ? (
                    <Link
                      className="project-view-member project-view-member-link"
                      to={`/portfolio/student/${encodeURIComponent(memberId)}`}
                      key={member.userId || member.email || index}
                      aria-label={`View ${member.name || "teammate"}'s portfolio`}
                    >
                      {memberInner}
                    </Link>
                  ) : (
                    <div className="project-view-member" key={index}>
                      {memberInner}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <ProjectViewSkillsSection skills={skills} />

          <section id="tools" className="project-view-card project-view-list-card">
            <div className="project-view-card-title">
              <span className="project-view-section-icon">
                <Code2 size={22} />
              </span>
              <h2>Tools</h2>
            </div>

            {tools.length ? (
              <div className="project-view-tools-tags">
                {tools.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : (
              <div className="project-view-soft-empty">No tools yet</div>
            )}
          </section>

          <section id="features" className="project-view-card project-view-list-card">
            <div className="project-view-card-title">
              <span className="project-view-section-icon">
                <ListChecks size={22} />
              </span>
              <h2>Features</h2>
            </div>

            {features.length ? (
              <div className="project-view-feature-list">
                {features.map((feature) => (
                  <span key={feature} className="project-view-feature-row">
                    <CheckCircle2 size={16} />
                    <strong>{feature}</strong>
                    <small aria-hidden="true" />
                  </span>
                ))}
              </div>
            ) : (
              <div className="project-view-soft-empty">No features yet</div>
            )}
          </section>
        </aside>
      </div>

      {!isPublicView && isAiOpen && (
        <div className="project-ai-overlay">
          <div className="project-ai-popup">
            <button
              type="button"
              className="project-ai-close"
              onClick={() => setIsAiOpen(false)}
              aria-label="Close AI check"
            >
              <X size={18} />
            </button>

            <div className="project-ai-head">
              <span>
                <Sparkles size={20} />
              </span>

              <div>
                <p>Project AI Check</p>
                <h2>Content Review</h2>
              </div>
            </div>

            <div className="project-ai-body">
              {aiLoading && <p className="project-ai-muted">Checking project content...</p>}
              {aiError && <p className="project-ai-error">{aiError}</p>}

              {!aiLoading && !aiError && aiResult && (
                <div className="project-ai-result">
                  <strong>{likelihoodLabel(aiResult.ai_likelihood)}</strong>

                  <div className="project-ai-score-grid">
                    <span>Overall: {scoreText(aiResult.overall_score)}</span>
                    <span>Clarity: {scoreText(aiResult.clarity_score)}</span>
                    <span>Completeness: {scoreText(aiResult.completeness_score)}</span>
                  </div>

                  <p>{aiResult.feedback}</p>

                  {Array.isArray(aiResult.improvement_suggestions) && aiResult.improvement_suggestions.length > 0 && (
                    <ul className="project-ai-suggestions">
                      {aiResult.improvement_suggestions.slice(0, 4).map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectViewPage({ publicView = false }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getProjectById(projectId).then((foundProject) => {
      if (!isMounted) return;

      if (foundProject?.id || foundProject?.title) {
        setProject(foundProject);
        return;
      }

      setProject(foundProject);
    });


    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const content = <ProjectViewContent project={project || {}} isPublicView={publicView} />;

  if (publicView) {
    return (
      <ProjectShell project={project}>
        {content}
      </ProjectShell>
    );
  }

  return content;
}

export default ProjectViewPage;
