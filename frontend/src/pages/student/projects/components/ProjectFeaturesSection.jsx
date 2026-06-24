import { ListChecks, Trash2 } from "lucide-react";
import { makeProjectTempId } from "../services/projectApi";
function normalizeFeatures(features) {
  if (!Array.isArray(features)) return [];

  return features.map((feature) => {
    if (typeof feature === "string") {
      return {
        id: null,
        tempId: makeProjectTempId(),
        name: feature,
      };
    }

    return {
      id: feature.id ?? null,
      tempId: feature.tempId ?? makeProjectTempId(),
      name: feature.name ?? "",
    };
  });
}

function ProjectFeaturesSection({ features = [], onChange, onNotify, isEditing }) {
  const safeFeatures = normalizeFeatures(features);

  const addFeature = () => {
    onChange?.([
      ...safeFeatures,
      {
        id: null,
        tempId: makeProjectTempId(),
        name: "",
      },
    ]);

    onNotify?.("success", "Added");
  };

  const updateFeature = (index, value) => {
    const updatedFeatures = safeFeatures.map((feature, featureIndex) =>
      featureIndex === index ? { ...feature, name: value } : feature
    );

    onChange?.(updatedFeatures);
  };

  const removeFeature = (index) => {
    if (!isEditing) return;

    const updatedFeatures = safeFeatures.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedFeatures);
    onNotify?.("info", "Removed");
  };

  return (
    <section className="project-section-card project-features-card">
      <h2 className="project-section-title">
        <ListChecks className="project-title-icon" aria-hidden="true" />
        Features
      </h2>

      {safeFeatures.length === 0 && (
        <p className="project-empty-state">No features added yet</p>
      )}

      <div className="project-feature-list">
        {safeFeatures.map((feature, index) => (
          <div
            className="project-feature-row"
            key={feature.id ?? feature.tempId ?? index}
          >
            <div className="project-feature-field">
              <label>FEATURE</label>

              <input
                disabled={!isEditing}
                value={feature.name}
                onChange={(e) => updateFeature(index, e.target.value)}
              />
            </div>

            {isEditing && (
              <button
                type="button"
                className="project-row-delete-btn"
                onClick={() => removeFeature(index)}
                title="Delete feature"
              >
                <Trash2 className="project-row-delete-icon" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button type="button" className="project-feature-add-btn" onClick={addFeature}>
          + Add feature
        </button>
      )}
    </section>
  );
}

export default ProjectFeaturesSection;
