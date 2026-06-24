import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ToastMessage from "../../../../components/ToastMessage";
import { createEmptyProject } from "../services/projectApi";
import { useProjectEditor } from "../hooks/useProjectEditor";
import CreateProjectHeader from "./CreateProjectPage/components/CreateProjectHeader";
import CreateProjectForm from "./CreateProjectPage/components/CreateProjectForm";
function CreateProjectPage() {
  const navigate = useNavigate();
  const [project, setProject] = useState(createEmptyProject());

  const handleSaved = useCallback(
    (savedProject) => {
      if (savedProject?.id) {
        navigate(`/project/${savedProject.id}/edit`, { replace: true });
      }
    },
    [navigate]
  );

  const editorOptions = useMemo(
    () => ({
      initialEditing: true,
      onSaved: handleSaved,
      keepEditingAfterDraft: false,
    }),
    [handleSaved]
  );

  const {
    safeProject,
    isEditing,
    saving,
    errors,
    toast,
    setToast,
    notify,
    updateProject,
    saveDraft,
    submitForReview,
  } = useProjectEditor(project, setProject, editorOptions);

  return (
    <>
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <div className="project-editor-container create-project-container">
        <CreateProjectHeader
          saving={saving}
          onBack={() => navigate("/project")}
          onSaveDraft={saveDraft}
          onSubmitForReview={submitForReview}
        />

        <CreateProjectForm
          project={safeProject}
          errors={errors}
          updateProject={updateProject}
          notify={notify}
          isEditing={isEditing}
        />
      </div>
    </>
  );
}

export default CreateProjectPage;
