import { useState } from "react";
import { Target } from "lucide-react";
import { makeTempId } from "../services/profileApi";
function normalizeTargetRoles(targetRoles) {
  if (!Array.isArray(targetRoles)) return [];

  return targetRoles.map((role) => {
    if (typeof role === "string") {
      return {
        id: null,
        tempId: makeTempId(),
        name: role,
      };
    }

    return {
      id: role.id ?? null,
      tempId: role.tempId ?? makeTempId(),
      name: role.name ?? "",
    };
  });
}

function TargetRolesSection({
  targetRoles = [],
  onChange,
  onNotify,
  isEditing,
}) {
  const [roleInput, setRoleInput] = useState("");
  const safeTargetRoles = normalizeTargetRoles(targetRoles);

  const addTargetRole = () => {
    const value = roleInput.trim();

    if (!value) {
      onNotify?.("error", "Enter role.");
      return;
    }

    const exists = safeTargetRoles.some(
      (role) => role.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      onNotify?.("error", "Already added.");
      return;
    }

    onChange?.([
      ...safeTargetRoles,
      {
        id: null,
        tempId: makeTempId(),
        name: value,
      },
    ]);

    setRoleInput("");
    onNotify?.("success", "Added.");
  };

  const removeTargetRole = (index) => {
    if (!isEditing) return;

    const updatedRoles = safeTargetRoles.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedRoles);
    onNotify?.("info", "Removed.");
  };

  return (
    <section className="profile-section-card target-roles-card">
      <h2 className="profile-section-title">
        <Target className="section-title-icon" aria-hidden="true" />
        Target roles
      </h2>

      {safeTargetRoles.length === 0 && (
        <p className="empty-state">No target roles added yet</p>
      )}

      <div className="target-roles-list">
        {safeTargetRoles.map((role, index) => (
          <button
            type="button"
            key={role.id ?? role.tempId ?? index}
            className={`target-role-pill ${isEditing ? "editable" : ""}`}
            onClick={() => removeTargetRole(index)}
            title={isEditing ? "Click to remove" : ""}
          >
            {role.name}
            {isEditing && <span>×</span>}
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="add-target-role-row">
          <input
            placeholder="e.g., Developer" 
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTargetRole();
              }
            }}
          />

          <button type="button" className="ep-add-btn" onClick={addTargetRole}>
            + Add
          </button>
        </div>
      )}
    </section>
  );
}

export default TargetRolesSection;