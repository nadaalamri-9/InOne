import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

import { formatFeedbackDate } from "../utils/feedbackHelpers";
// Centered, full-page popup. Escape-to-close and background scroll lock are
// handled by useFeedback so this component stays purely presentational.
function FeedbackMessageModal({ feedback, onClose }) {
  if (!feedback) return null;

  return (
    <div className="feedback-message-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="feedback-message-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-message-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="feedback-message-modal-close"
          aria-label="Close message view"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>

        <div className="feedback-message-modal-topline">
          <div className="feedback-message-modal-coach">
            {feedback.coachPhoto ? (
              <img src={feedback.coachPhoto} alt={feedback.coachName} />
            ) : (
              <span className="feedback-coach-fallback">{feedback.coachInitials}</span>
            )}

            <div>
              <span className="feedback-row-label">Coach</span>
              <h2 id="feedback-message-title">{feedback.coachName}</h2>
            </div>
          </div>

          <div className="feedback-message-modal-sent-inline">
            <span className="feedback-row-label">Sent time</span>
            <strong>{formatFeedbackDate(feedback.createdAt)}</strong>
          </div>
        </div>

        <div className="feedback-message-modal-row">
          <div className="feedback-message-modal-project feedback-message-modal-project-status">
            <div className="feedback-message-modal-project-info">
              <span className="feedback-row-label">Project</span>
              <strong>{feedback.projectTitle}</strong>
            </div>

            <div className="feedback-message-modal-project-state">
              <span className="feedback-row-label">Status</span>
              <span className={`feedback-status-pill feedback-status-${feedback.projectStatusKey}`}>
                {feedback.projectStatus}
              </span>
            </div>
          </div>

          <div className="feedback-message-full-text">
            <span className="feedback-row-label">Full message</span>
            <p>{feedback.message}</p>
          </div>
        </div>

        <div className="feedback-message-modal-actions">
          <button type="button" className="feedback-message-secondary-button" onClick={onClose}>
            Close
          </button>

          {feedback.projectId && (
            <Link
              to={`/portfolio/project/${feedback.projectId}`}
              className="feedback-project-link feedback-message-project-link"
            >
              View project
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default FeedbackMessageModal;
