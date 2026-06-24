
import ProjectToolsSection from "../../../components/ProjectToolsSection";
function CreateProjectTools({ tools, onChange, error, onNotify, isEditing }) {
  return (
    <ProjectToolsSection
        tools={tools}
        onChange={onChange}
        error={error}
        onNotify={onNotify}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectTools;
