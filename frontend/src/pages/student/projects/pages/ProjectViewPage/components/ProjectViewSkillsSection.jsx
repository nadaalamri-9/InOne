import { Code2 } from "lucide-react";
function ProjectViewSkillsSection({ skills = [], className = "" }) {
  return (
    <section className={`project-view-card project-view-list-card project-view-skills-card ${className}`}>
      <div className="project-view-card-title">
        <span className="project-view-section-icon">
          <Code2 size={22} />
        </span>
        <h2>Skills</h2>
      </div>

      {skills.length ? (
        <div className="project-view-skill-tags">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      ) : (
        <div className="project-view-soft-empty">No skills yet</div>
      )}
    </section>
  );
}

export default ProjectViewSkillsSection;
