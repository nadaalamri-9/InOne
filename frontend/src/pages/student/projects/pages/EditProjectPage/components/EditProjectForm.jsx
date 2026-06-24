
import ProjectBasicsSection from "../../../components/ProjectBasicsSection";
import ProjectFeaturesSection from "../../../components/ProjectFeaturesSection";
import ProjectLinksSection from "../../../components/ProjectLinksSection";
import ProjectSkillsSection from "../../../components/ProjectSkillsSection";
import ProjectToolsSection from "../../../components/ProjectToolsSection";
import RoleResultsSection from "../../../components/RoleResultsSection";
import ScreenshotsUploadSection from "../../../components/ScreenshotsUploadSection";
import SolutionArchitectureSection from "../../../components/SolutionArchitectureSection";
import TeamMembersSection from "../../../components/TeamMembersSection";
function EditProjectForm({
  project,
  updateProject,
  errors,
  notify,
  isEditing,
}) {
  return (
    <div className="project-grid-layout">
      <div className="project-left-column">
        <ProjectBasicsSection
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <SolutionArchitectureSection
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <RoleResultsSection
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <ProjectFeaturesSection
          features={project.features}
          onChange={(features) => updateProject("features", features)}
          onNotify={notify}
          isEditing={isEditing}
        />
      </div>

      <div className="project-right-column">
        <ProjectLinksSection
          project={project}
          updateProject={updateProject}
          errors={errors}
          isEditing={isEditing}
        />

        <TeamMembersSection
          teamMembers={project.teamMembers}
          isSoloProject={project.isSoloProject}
          onChange={(teamMembers) => updateProject("teamMembers", teamMembers)}
          onSoloChange={(isSoloProject) => updateProject("isSoloProject", isSoloProject)}
          errors={errors.teamMembers}
          onNotify={notify}
          isEditing={isEditing}
        />

        <ProjectToolsSection
          tools={project.tools}
          onChange={(tools) => updateProject("tools", tools)}
          error={errors.tools}
          onNotify={notify}
          isEditing={isEditing}
        />

        <ProjectSkillsSection
          skills={project.skills}
          onChange={(skills) => updateProject("skills", skills)}
          onNotify={notify}
          isEditing={isEditing}
        />

        <ScreenshotsUploadSection
          screenshots={project.screenshots}
          onChange={(screenshots) => updateProject("screenshots", screenshots)}
          onNotify={notify}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export default EditProjectForm;
