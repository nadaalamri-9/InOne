
import TeamMembersSection from "../../../components/TeamMembersSection";
function CreateProjectTeamMembers({
  teamMembers,
  isSoloProject,
  onChange,
  onSoloChange,
  errors,
  onNotify,
  isEditing,
}) {
  return (
    <TeamMembersSection
        teamMembers={teamMembers}
        isSoloProject={isSoloProject}
        onChange={onChange}
        onSoloChange={onSoloChange}
        errors={errors}
        onNotify={onNotify}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectTeamMembers;
