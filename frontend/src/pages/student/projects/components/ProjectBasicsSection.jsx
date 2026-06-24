import { AlignLeft, BookOpenText, CalendarDays, ClipboardList, Type } from "lucide-react";
function ProjectBasicsSection({ project, updateProject, errors, isEditing }) {
  return (
    <section className="project-section-card project-basics-card">
      <h2 className="project-section-title">
        <ClipboardList className="project-title-icon" aria-hidden="true" />
        Project basics
      </h2>

      <div className="project-form-grid">
        <div className="project-form-group">
          <label className="project-label-with-icon">
            <Type className="project-field-icon" aria-hidden="true" />
            TITLE
          </label>

          <input
            disabled={!isEditing}
            className={errors.title ? "input-error" : ""}
            value={project.title}
            onChange={(e) => updateProject("title", e.target.value)}
            placeholder="Name your project"
          />

          {errors.title && (
            <span className="project-field-error">{errors.title}</span>
          )}
        </div>

        <div className="project-form-group">
          <label className="project-label-with-icon">
            <CalendarDays className="project-field-icon" aria-hidden="true" />
            DURATION
          </label>

          <input
            disabled={!isEditing}
            value={project.duration}
            onChange={(e) => updateProject("duration", e.target.value)}
            placeholder="4 weeks or Jan 2026 - Feb 2026"
          />
        </div>

        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <AlignLeft className="project-field-icon" aria-hidden="true" />
            SUMMARY
          </label>

          <textarea
            disabled={!isEditing}
            className={`project-summary-textarea ${errors.summary ? "input-error" : ""}`.trim()}
            value={project.summary}
            onChange={(e) => updateProject("summary", e.target.value)}
            placeholder="Write a short summary of your project"
          />

          {errors.summary && (
            <span className="project-field-error">{errors.summary}</span>
          )}
        </div>

        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <BookOpenText className="project-field-icon" aria-hidden="true" />
            OVERVIEW
          </label>

          <textarea
            disabled={!isEditing}
            className="project-overview-textarea"
            value={project.overview}
            onChange={(e) => updateProject("overview", e.target.value)}
            placeholder="Describe the project idea, goal, and main features"
          />

        </div>
      </div>
    </section>
  );
}

export default ProjectBasicsSection;
