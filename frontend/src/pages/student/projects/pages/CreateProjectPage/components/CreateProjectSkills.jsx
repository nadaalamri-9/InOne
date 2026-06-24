
import ProjectSkillsSection from "../../../components/ProjectSkillsSection";
function CreateProjectSkills({ skills, onChange, onNotify, isEditing }) {
  return (
    <ProjectSkillsSection
        skills={skills}
        onChange={onChange}
        onNotify={onNotify}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectSkills;
