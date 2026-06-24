
import ProjectBasicsSection from "../../../components/ProjectBasicsSection";
function CreateProjectBasics({ project, updateProject, errors, isEditing }) {
  return (
    <ProjectBasicsSection
        project={project}
        updateProject={updateProject}
        errors={errors}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectBasics;
