
import ProjectFeaturesSection from "../../../components/ProjectFeaturesSection";
function CreateProjectFeatures({ features, onChange, onNotify, isEditing }) {
  return (
    <ProjectFeaturesSection
        features={features}
        onChange={onChange}
        onNotify={onNotify}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectFeatures;
