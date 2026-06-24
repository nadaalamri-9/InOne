import { Trophy, UserCog } from "lucide-react";
function RoleResultsSection({ project, updateProject, errors, isEditing }) {
  return (
    <section className="project-section-card role-results-card">
      <h2 className="project-section-title">
        <UserCog className="project-title-icon" aria-hidden="true" />
        Role & results
      </h2>

      <div className="project-form-grid single-column">
        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <UserCog className="project-field-icon" aria-hidden="true" />
            ROLE
          </label>

          <textarea
            disabled={!isEditing}
            className={`project-role-textarea ${errors.role ? "input-error" : ""}`.trim()}
            value={project.role}
            onChange={(e) => updateProject("role", e.target.value)}
            placeholder="e.g. UI Designer"
          />

          {errors.role && (
            <span className="project-field-error">{errors.role}</span>
          )}
        </div>

        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <Trophy className="project-field-icon" aria-hidden="true" />
            RESULTS
          </label>

          <textarea
            disabled={!isEditing}
            className="project-results-textarea"
            value={project.results}
            onChange={(e) => updateProject("results", e.target.value)}
            placeholder="Describe the project outcome"
          />
        </div>
      </div>
    </section>
  );
}

export default RoleResultsSection;
