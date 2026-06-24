import { useState } from "react";
import { Sparkles } from "lucide-react";
import { makeTempId } from "../services/profileApi";
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];

  return skills.map((skill) => {
    if (typeof skill === "string") {
      return {
        id: null,
        tempId: makeTempId(),
        name: skill,
      };
    }

    return {
      id: skill.id ?? null,
      tempId: skill.tempId ?? makeTempId(),
      name: skill.name ?? "",
    };
  });
}

function SkillsSection({ skills = [], onChange, onNotify, isEditing }) {
  const [skillInput, setSkillInput] = useState("");
  const safeSkills = normalizeSkills(skills);

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) {
      onNotify?.("error", "Enter skill.");
      return;
    }

    const exists = safeSkills.some(
      (skill) => skill.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      onNotify?.("error", "Already added.");
      return;
    }

    onChange?.([
      ...safeSkills,
      {
        id: null,
        tempId: makeTempId(),
        name: value,
      },
    ]);

    setSkillInput("");
    onNotify?.("success", "Added.");
  };

  const removeSkill = (index) => {
    if (!isEditing) return;

    const updatedSkills = safeSkills.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedSkills);
    onNotify?.("info", "Removed.");
  };

  return (
    <section className="profile-section-card skills-card">
      <h2 className="profile-section-title">
        <Sparkles className="section-title-icon" aria-hidden="true" />
        Skills
      </h2>

      {safeSkills.length === 0 && (
        <p className="empty-state">No skills added yet.</p>
      )}

      <div className="skills-list">
        {safeSkills.map((skill, index) => (
          <button
            type="button"
            key={skill.id ?? skill.tempId ?? index}
            className={`skill-pill ${isEditing ? "editable" : ""}`}
            onClick={() => removeSkill(index)}
            title={isEditing ? "Click to remove" : ""}
          >
            {skill.name}
            {isEditing && <span>×</span>}
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="add-skill-row">
          <input
            placeholder="e.g., React, Python" 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />

          <button type="button" className="ep-add-btn" onClick={addSkill}>
            + Add
          </button>
        </div>
      )}
    </section>
  );
}

export default SkillsSection;