import { CheckCircle2, ImagePlus, Link2, Star, Trash2, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePic from "../../../../../../assets/ProfilePic.svg";
import ProjectStatusPill from "./ProjectStatusPill";
import {
  formatProjectSavedAt,
  getFirstScreenshot,
  getProjectLinkItems,
  getProjectSavedLabel,
  getProjectTagGroups,
  getTeamMembers,
  getTemplateSections,
} from "../utils/projectViewHelpers";
function ProjectCard({ project, isDeleteMode, onRequestDelete }) {
  const navigate = useNavigate();
  const tagGroups = useMemo(() => getProjectTagGroups(project), [project]);
  const firstScreenshot = useMemo(() => getFirstScreenshot(project), [project]);
  const teamMembers = useMemo(() => getTeamMembers(project), [project]);
  const visibleMembers = teamMembers.slice(0, 3);
  const extraMembersCount = Math.max(teamMembers.length - visibleMembers.length, 0);

  const openProjectEditor = () => {
    if (isDeleteMode) return;
    navigate(`/project/${project.id}/edit`);
  };

  const handleDeleteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRequestDelete(project);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectEditor();
    }
  };

  return (
    <article
      className={`project-list-card project-list-card-clickable ${isDeleteMode ? "is-delete-mode" : ""}`}
      role="button"
      tabIndex={0}
      onClick={openProjectEditor}
      onKeyDown={handleCardKeyDown}
      aria-label={isDeleteMode ? `Delete ${project.title || "project"}` : `Edit ${project.title || "project"}`}
    >
      <div className="project-card-thumbnail">
        {firstScreenshot ? (
          <img src={firstScreenshot} alt={project.title || "Project screenshot"} />
        ) : (
          <div className="project-card-thumbnail-placeholder">
            <ImagePlus className="project-card-thumbnail-icon" aria-hidden="true" />
            <span>No image yet</span>
          </div>
        )}

        <ProjectStatusPill status={project.status} />

        {isDeleteMode && (
          <button
            type="button"
            className="project-card-delete-btn"
            onClick={handleDeleteClick}
            aria-label={`Delete ${project.title || "project"}`}
            title="Delete project"
          >
            <Trash2 className="project-card-delete-icon" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="project-card-body">
        <h2>
          {project.title || "Untitled project"}
          {project.isFeatured && <Star className="project-featured-icon" />}
        </h2>

        <p className="project-card-summary">
          {project.summary ||
            project.overview ||
            "No summary yet"}
        </p>

        <div className="project-card-tags">
          {tagGroups.tools.length > 0 ? (
            tagGroups.tools.map((tag) => (
              <span key={`tool-${tag}`} className="project-card-tag project-card-tool-tag">
                {tag}
              </span>
            ))
          ) : (
            <span className="project-card-tag muted-tag">No tools yet</span>
          )}

          {tagGroups.skills.length > 0 ? (
            tagGroups.skills.map((tag) => (
              <span key={`skill-${tag}`} className="project-card-tag project-card-skill-tag">
                {tag}
              </span>
            ))
          ) : (
            <span className="project-card-tag muted-skill-tag">No skills yet</span>
          )}
        </div>

        <div className="project-card-template-row" aria-label="Project template readiness">
          {getTemplateSections(project).map((section) => (
            <span
              key={section.key}
              className={section.ready ? "template-chip is-ready" : "template-chip"}
            >
              {section.key}
            </span>
          ))}
        </div>

        <div className="project-card-team-row">
          <div className="project-card-team-label">
            <UsersRound className="project-card-team-icon" aria-hidden="true" />
            <span>Team</span>
          </div>

          {teamMembers.length > 0 ? (
            <div className="project-card-team-members">
              <div className="project-card-team-avatars">
                {visibleMembers.map((member, index) => (
                  <img
                    key={member.userId ?? member.id ?? member.tempId ?? index}
                    src={member.photoUrl || ProfilePic}
                    alt=""
                  />
                ))}

                {extraMembersCount > 0 && (
                  <span className="project-card-team-extra">+{extraMembersCount}</span>
                )}
              </div>

              <span className="project-card-team-count">
                {teamMembers.length} member{teamMembers.length > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <span className="project-card-team-empty project-card-team-solo">
              <CheckCircle2 className="project-card-team-solo-icon" aria-hidden="true" />
              <span>Solo project</span>
            </span>
          )}
        </div>

        <div className="project-card-links-row" aria-label="Project links readiness">
          <span className="project-card-links-label">
            <Link2 className="project-card-links-label-icon" aria-hidden="true" />
            <span>Links</span>
          </span>

          <div className="project-card-link-icons">
            {getProjectLinkItems(project).map(({ key, ready, icon }) => {
              const linkKeyClass = key.toLowerCase();

              return (
                <span
                  key={key}
                  className={`project-card-link-chip project-card-link-${linkKeyClass} ${ready ? "is-ready" : ""}`}
                  title={ready ? `${key} added` : `${key} missing`}
                >
                  <img src={icon} alt="" className="project-card-link-icon-img" />
                  <span>{key}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="project-card-footer">
          <div className="project-card-updated">
            <span>{getProjectSavedLabel(project)}</span>
            <strong>{formatProjectSavedAt(project.updatedAt)}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
