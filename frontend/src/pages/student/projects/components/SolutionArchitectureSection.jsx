import { CircleAlert, Lightbulb, Network, Workflow } from "lucide-react";
function SolutionArchitectureSection({ project, updateProject, errors, isEditing }) {
  return (
    <section className="project-section-card solution-architecture-card">
      <h2 className="project-section-title">
        <Workflow className="project-title-icon" aria-hidden="true" />
        Solution & architecture
      </h2>

      <div className="project-form-grid single-column">
        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <CircleAlert className="project-field-icon" aria-hidden="true" />
            BUSINESS PROBLEM
          </label>

          <textarea
            disabled={!isEditing}
            className={errors.businessProblem ? "input-error" : ""}
            value={project.businessProblem}
            onChange={(e) => updateProject("businessProblem", e.target.value)}
            placeholder="Explain the problem your project solves"
          />

          {errors.businessProblem && (
            <span className="project-field-error">
              {errors.businessProblem}
            </span>
          )}
        </div>

        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <Lightbulb className="project-field-icon" aria-hidden="true" />
            SOLUTION
          </label>

          <textarea
            disabled={!isEditing}
            className={errors.solution ? "input-error" : ""}
            value={project.solution}
            onChange={(e) => updateProject("solution", e.target.value)}
            placeholder="Describe how your project solves the problem"
          />

          {errors.solution && (
            <span className="project-field-error">{errors.solution}</span>
          )}
        </div>

        <div className="project-form-group full-width">
          <label className="project-label-with-icon">
            <Network className="project-field-icon" aria-hidden="true" />
            ARCHITECTURE
          </label>

          <textarea
            disabled={!isEditing}
            value={project.architecture}
            onChange={(e) => updateProject("architecture", e.target.value)}
            placeholder="Describe the project structure"
          />
        </div>
      </div>
    </section>
  );
}

export default SolutionArchitectureSection;
