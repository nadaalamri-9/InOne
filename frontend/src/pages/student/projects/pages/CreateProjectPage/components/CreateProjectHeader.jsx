import { ArrowLeft, Save, Send } from "lucide-react";
function CreateProjectHeader({ saving, onBack, onSaveDraft, onSubmitForReview }) {
  return (
    <header className="project-editor-header create-project-header">
      <div className="project-editor-heading">
        <div className="project-editor-title-row">
          <button
            type="button"
            className="project-back-icon-btn"
            onClick={onBack}
            aria-label="Back to projects"
            title="Back to projects"
          >
            <ArrowLeft className="project-action-icon" aria-hidden="true" />
          </button>

          <h1>Create Project</h1>
        </div>
        <p>Prepare your project for coach review</p>
      </div>

      <div className="project-header-actions">
        <div className="project-edit-actions">
          <button
            type="button"
            className="project-draft-btn"
            onClick={onSaveDraft}
            disabled={saving}
          >
            <Save className="project-action-icon" aria-hidden="true" />
            {saving ? "Saving..." : "Save draft"}
          </button>


          <button
            type="button"
            className="project-publish-btn"
            onClick={onSubmitForReview}
            disabled={saving}
          >
            <Send className="project-action-icon" aria-hidden="true" />
            {saving ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default CreateProjectHeader;
