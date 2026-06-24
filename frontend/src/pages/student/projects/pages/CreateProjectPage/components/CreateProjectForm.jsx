
import CreateProjectBasics from "./CreateProjectBasics";
import CreateProjectSolutionArchitecture from "./CreateProjectSolutionArchitecture";
import CreateProjectRoleResults from "./CreateProjectRoleResults";
import CreateProjectFeatures from "./CreateProjectFeatures";
import CreateProjectLinks from "./CreateProjectLinks";
import CreateProjectTeamMembers from "./CreateProjectTeamMembers";
import CreateProjectTools from "./CreateProjectTools";
import CreateProjectSkills from "./CreateProjectSkills";
import CreateProjectScreenshots from "./CreateProjectScreenshots";
function CreateProjectForm({
  project,
  errors,
  updateProject,
  notify,
  isEditing,
}) {
  return (
    <div className="project-grid-layout create-project-grid-layout">
      <div className="project-left-column">
        <CreateProjectBasics
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <CreateProjectSolutionArchitecture
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <CreateProjectRoleResults
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <CreateProjectFeatures
          features={project.features}
          onChange={(features) => updateProject("features", features)}
          onNotify={notify}
          isEditing={isEditing}
        />
      </div>

      <div className="project-right-column">
        <CreateProjectLinks
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <CreateProjectTeamMembers
          teamMembers={project.teamMembers}
          isSoloProject={project.isSoloProject}
          onChange={(teamMembers) => updateProject("teamMembers", teamMembers)}
          onSoloChange={(isSoloProject) =>
            updateProject("isSoloProject", isSoloProject)
          }
          errors={errors.teamMembers}
          onNotify={notify}
          isEditing={isEditing}
        />

        <CreateProjectTools
          tools={project.tools}
          onChange={(tools) => updateProject("tools", tools)}
          error={errors.tools}
          onNotify={notify}
          isEditing={isEditing}
        />

        <CreateProjectSkills
          skills={project.skills}
          onChange={(skills) => updateProject("skills", skills)}
          onNotify={notify}
          isEditing={isEditing}
        />

        <CreateProjectScreenshots
          screenshots={project.screenshots}
          onChange={(screenshots) => updateProject("screenshots", screenshots)}
          onNotify={notify}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export default CreateProjectForm;
