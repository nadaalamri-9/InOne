
import RoleResultsSection from "../../../components/RoleResultsSection";
function CreateProjectRoleResults({ project, updateProject, errors, isEditing }) {
  return (
    <RoleResultsSection
        project={project}
        updateProject={updateProject}
        errors={errors}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectRoleResults;
