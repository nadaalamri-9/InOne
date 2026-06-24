import { Trash2, X } from "lucide-react";
import ProjectStatusPill from "./ProjectStatusPill";
import { formatProjectSavedAt, getNormalizedProjectStatus } from "../utils/projectViewHelpers";
function ProjectDeleteModal({ project, isDeleting, onClose, onConfirm }) {
  if (!project) return null;

  const isPublished = getNormalizedProjectStatus(project.status) === "published";
  const deleteMessage = isPublished
    ? "Deleting this project will remove it from your portfolio permanently"
    : "Once deleted, this project and all its content will be gone for good";

  return (
    <div className="projects-delete-modal-backdrop" role="presentation">
      <div
        className="projects-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
      >
        <button
          type="button"
          className="projects-delete-modal-close"
          onClick={onClose}
          aria-label="Close delete confirmation"
        >
          <X className="projects-delete-close-icon" aria-hidden="true" />
        </button>

        <div className="projects-delete-modal-icon-wrap">
          <Trash2 className="projects-delete-modal-icon" aria-hidden="true" />
        </div>

        <h2 id="delete-project-title">Delete this project?</h2>
        <p>{deleteMessage}</p>

        <div className="projects-delete-preview-card">
          <div className="projects-delete-preview-top">
            <strong>{project.title || "Untitled project"}</strong>

            <div className="projects-delete-status-date">
              <ProjectStatusPill status={project.status} />
              <strong>{formatProjectSavedAt(project.updatedAt)}</strong>
            </div>
          </div>
        </div>

        <div className="projects-delete-modal-actions">
          <button
            type="button"
            className="projects-delete-no-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            No
          </button>

          <button
            type="button"
            className="projects-delete-yes-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDeleteModal;
