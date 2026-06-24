import { ArrowLeft, Edit3, Save, Send } from "lucide-react";

import {
  formatProjectSavedAt,
  getProjectSavedLabel,
  getProjectStatusClass,
  getProjectStatusLabel,
} from "../utils/projectEditorHelpers";
function EditProjectHeader({
  project,
  isEditing,
  saving,
  onBack,
  onStartEditing,
  onSaveDraft,
  onSubmitForReview,
  onPublishProject,
}) {
  const savedAtText = formatProjectSavedAt(project.updatedAt);
  const normalizedStatus = String(project.status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const canPublish = normalizedStatus === "ready";
  const isPublished = normalizedStatus === "published";
  const canEdit = !canPublish && !isPublished;

  return (
    <header className="project-editor-header">
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

          <h1>Project</h1>
        </div>
        <p>Manage your project details</p>
      </div>

      <div className="project-header-actions">
        <span className={`project-status-badge ${getProjectStatusClass(project.status)}`}>
          {getProjectStatusLabel(project.status)}
        </span>

        {project.updatedAt && savedAtText && (
          <span className="project-updated-text">
            {getProjectSavedLabel(project.status)}: {savedAtText}
          </span>
        )}

        {!isEditing ? (
          <div className="project-edit-actions">
            {canPublish && (
              <button
                type="button"
                className="project-publish-btn"
                onClick={onPublishProject}
                disabled={saving}
              >
                <Send className="project-action-icon" aria-hidden="true" />
                {saving ? "Publishing..." : "Publish"}
              </button>
            )}

            {canEdit && (
              <button type="button" className="project-edit-btn" onClick={onStartEditing}>
                <Edit3 className="project-action-icon" aria-hidden="true" />
                Edit project
              </button>
            )}
          </div>
        ) : (
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
              onClick={canPublish ? onPublishProject : onSubmitForReview}
              disabled={saving}
            >
              <Send className="project-action-icon" aria-hidden="true" />
              {canPublish
                ? saving
                  ? "Publishing..."
                  : "Publish"
                : saving
                  ? "Submitting..."
                  : "Submit for review"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default EditProjectHeader;
