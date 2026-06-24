
import SolutionArchitectureSection from "../../../components/SolutionArchitectureSection";
function CreateProjectSolutionArchitecture({ project, updateProject, errors, isEditing }) {
  return (
    <SolutionArchitectureSection
        project={project}
        updateProject={updateProject}
        errors={errors}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectSolutionArchitecture;
