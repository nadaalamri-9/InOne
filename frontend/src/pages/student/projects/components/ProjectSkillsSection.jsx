import { useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";
import { makeProjectTempId } from "../services/projectApi";
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];

  return skills.map((skill) => {
    if (typeof skill === "string") {
      return {
        id: null,
        tempId: makeProjectTempId(),
        name: skill,
      };
    }

    return {
      id: skill.id ?? null,
      tempId: skill.tempId ?? makeProjectTempId(),
      name: skill.name ?? "",
    };
  });
}

function ProjectSkillsSection({ skills = [], onChange, onNotify, isEditing }) {
  const [skillInput, setSkillInput] = useState("");
  const safeSkills = normalizeSkills(skills);

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) {
      onNotify?.("error", "Add a skill");
      return;
    }

    const exists = safeSkills.some(
      (skill) => skill.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      onNotify?.("error", "Skill already exists");
      return;
    }

    onChange?.([
      ...safeSkills,
      {
        id: null,
        tempId: makeProjectTempId(),
        name: value,
      },
    ]);

    setSkillInput("");
    onNotify?.("success", "Added");
  };

  const removeSkill = (index) => {
    if (!isEditing) return;

    onChange?.(safeSkills.filter((_, itemIndex) => itemIndex !== index));
    onNotify?.("info", "Removed");
  };

  return (
    <section className="project-section-card project-skills-card">
      <h2 className="project-section-title">
        <BadgeCheck className="project-title-icon" aria-hidden="true" />
        Skills
      </h2>

      {safeSkills.length === 0 && (
        <p className="project-empty-state">No skills added yet</p>
      )}

      <div className="project-skills-list">
        {safeSkills.map((skill, index) => (
          <button
            type="button"
            key={skill.id ?? skill.tempId ?? index}
            className={`project-skill-pill ${isEditing ? "editable" : ""}`}
            onClick={() => removeSkill(index)}
            title={isEditing ? "Click to remove" : ""}
          >
            {skill.name}
            {isEditing && <span>×</span>}
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="project-add-skill-row">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. API Integration"
          />

          <button type="button" className="project-add-btn" onClick={addSkill}>
            <Plus className="project-small-btn-icon" aria-hidden="true" />
            Add
          </button>
        </div>
      )}
    </section>
  );
}

export default ProjectSkillsSection;
