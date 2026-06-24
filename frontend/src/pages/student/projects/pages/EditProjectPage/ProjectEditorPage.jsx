import { useNavigate, useParams } from "react-router-dom";

import ToastMessage from "../../../../../components/ToastMessage";
import { useProjectEditor } from "../../hooks/useProjectEditor";

import EditProjectForm from "./components/EditProjectForm";
import EditProjectHeader from "./components/EditProjectHeader";
import EditProjectLoading from "./components/EditProjectLoading";
import { useEditProjectLoader } from "./hooks/useEditProjectLoader";
function ProjectEditorPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { project, setProject, loading } = useEditProjectLoader(projectId);

  const editorOptions = {
    initialEditing: false,
    keepEditingAfterDraft: false,
  };

  const {
    safeProject,
    isEditing,
    saving,
    errors,
    toast,
    setToast,
    notify,
    startEditing,
    updateProject,
    saveDraft,
    submitForReview,
    publishProject,
  } = useProjectEditor(project, setProject, editorOptions);

  if (loading) {
    return <EditProjectLoading />;
  }

  return (
    <>
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <div className="project-editor-container">
        <EditProjectHeader
          project={safeProject}
          isEditing={isEditing}
          saving={saving}
          onBack={() => navigate("/project")}
          onStartEditing={startEditing}
          onSaveDraft={saveDraft}
          onSubmitForReview={submitForReview}
          onPublishProject={publishProject}
        />

        <EditProjectForm
          project={safeProject}
          updateProject={updateProject}
          errors={errors}
          notify={notify}
          isEditing={isEditing}
        />
      </div>
    </>
  );
}

export default ProjectEditorPage;
