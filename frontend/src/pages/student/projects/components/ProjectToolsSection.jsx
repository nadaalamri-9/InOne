import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { makeProjectTempId } from "../services/projectApi";
function normalizeTools(tools) {
  if (!Array.isArray(tools)) return [];

  return tools.map((tool) => {
    if (typeof tool === "string") {
      return {
        id: null,
        tempId: makeProjectTempId(),
        name: tool,
      };
    }

    return {
      id: tool.id ?? null,
      tempId: tool.tempId ?? makeProjectTempId(),
      name: tool.name ?? "",
    };
  });
}

function ProjectToolsSection({ tools = [], onChange, error, onNotify, isEditing }) {
  const [toolInput, setToolInput] = useState("");
  const safeTools = normalizeTools(tools);

  const addTool = () => {
    const value = toolInput.trim();

    if (!value) {
      onNotify?.("error", "Add a tool");
      return;
    }

    const exists = safeTools.some(
      (tool) => tool.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      onNotify?.("error", "Tool already exists");
      return;
    }

    onChange?.([
      ...safeTools,
      {
        id: null,
        tempId: makeProjectTempId(),
        name: value,
      },
    ]);

    setToolInput("");
    onNotify?.("success", "Added");
  };

  const removeTool = (index) => {
    if (!isEditing) return;

    onChange?.(safeTools.filter((_, itemIndex) => itemIndex !== index));
    onNotify?.("info", "Removed");
  };

  return (
    <section className="project-section-card project-tools-card">
      <h2 className="project-section-title">
        <Wrench className="project-title-icon" aria-hidden="true" />
        Tools
      </h2>

      {safeTools.length === 0 && (
        <p className="project-empty-state">No tools added yet</p>
      )}

      <div className="project-tools-list">
        {safeTools.map((tool, index) => (
          <button
            type="button"
            key={tool.id ?? tool.tempId ?? index}
            className={`project-tool-pill ${isEditing ? "editable" : ""}`}
            onClick={() => removeTool(index)}
            title={isEditing ? "Click to remove" : ""}
          >
            {tool.name}
            {isEditing && <span>×</span>}
          </button>
        ))}
      </div>

      {error && <span className="project-field-error">{error}</span>}

      {isEditing && (
        <div className="project-add-tool-row">
          <input
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTool();
              }
            }}
            placeholder="e.g. React"
          />

          <button type="button" className="project-add-btn" onClick={addTool}>
            <Plus className="project-small-btn-icon" aria-hidden="true" />
            Add
          </button>
        </div>
      )}
    </section>
  );
}

export default ProjectToolsSection;
