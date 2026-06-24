import { Link2 } from "lucide-react";

import GitHubIcon from "../../../../assets/GitHub.svg";
import WebSiteIcon from "../../../../assets/WebSite.svg";
function ProjectLinksSection({ project, updateProject, errors, isEditing }) {
  return (
    <section className="project-section-card project-links-card">
      <h2 className="project-section-title">
        <Link2 className="project-title-icon" aria-hidden="true" />
        Project links
      </h2>

      <div className="project-link-grid">
        <div className="project-link-field">
          <div className="project-link-input-wrapper">
            <img src={GitHubIcon} alt="" className="project-link-input-icon" />

            <input
              disabled={!isEditing}
              className={`project-link-input ${
                errors.githubUrl ? "input-error" : ""
              }`}
              value={project.githubUrl}
              onChange={(e) => updateProject("githubUrl", e.target.value)}
              placeholder="GitHub URL"
            />
          </div>

          {errors.githubUrl && (
            <span className="project-field-error">{errors.githubUrl}</span>
          )}
        </div>

        <div className="project-link-field">
          <div className="project-link-input-wrapper">
            <img src={WebSiteIcon} alt="" className="project-link-input-icon" />

            <input
              disabled={!isEditing}
              className={`project-link-input ${errors.demoUrl ? "input-error" : ""}`}
              value={project.demoUrl}
              onChange={(e) => updateProject("demoUrl", e.target.value)}
              placeholder="Demo URL"
            />
          </div>

          {errors.demoUrl && (
            <span className="project-field-error">{errors.demoUrl}</span>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectLinksSection;
