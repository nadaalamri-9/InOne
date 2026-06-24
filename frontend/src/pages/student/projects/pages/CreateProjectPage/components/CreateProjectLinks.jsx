
import ProjectLinksSection from "../../../components/ProjectLinksSection";
function CreateProjectLinks({ project, updateProject, errors, isEditing }) {
  return (
    <ProjectLinksSection
        project={project}
        updateProject={updateProject}
        errors={errors}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectLinks;
