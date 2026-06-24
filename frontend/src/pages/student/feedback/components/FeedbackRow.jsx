import { MessageSquareText } from "lucide-react";

import { formatFeedbackDate } from "../utils/feedbackHelpers";
function FeedbackRow({ item, onView }) {
  return (
    <article className="feedback-row-card" role="listitem">
      <div className="feedback-coach-cell">
        {item.coachPhoto ? (
          <img src={item.coachPhoto} alt={item.coachName} />
        ) : (
          <span className="feedback-coach-fallback">{item.coachInitials}</span>
        )}

        <div>
          <span className="feedback-row-label">Coach</span>
          <strong>{item.coachName}</strong>
        </div>
      </div>

      <div className="feedback-project-cell">
        <span className="feedback-row-label">Project</span>
        <strong>{item.projectTitle}</strong>
        <span className={`feedback-status-pill feedback-status-${item.projectStatusKey}`}>
          {item.projectStatus}
        </span>
      </div>

      <div className="feedback-message-cell">
        <span className="feedback-row-label">Message</span>
        <p>{item.message}</p>
      </div>

      <div className="feedback-date-cell">
        <span className="feedback-row-label">Sent time</span>
        <time>{formatFeedbackDate(item.createdAt)}</time>
      </div>

      <div className="feedback-actions-cell">
        <button type="button" className="feedback-message-view-button" onClick={() => onView(item)}>
          Message
          <MessageSquareText aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default FeedbackRow;
