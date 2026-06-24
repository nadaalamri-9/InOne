
import ScreenshotsUploadSection from "../../../components/ScreenshotsUploadSection";
function CreateProjectScreenshots({ screenshots, onChange, onNotify, isEditing }) {
  return (
    <ScreenshotsUploadSection
        screenshots={screenshots}
        onChange={onChange}
        onNotify={onNotify}
        isEditing={isEditing}
      />
  );
}

export default CreateProjectScreenshots;
