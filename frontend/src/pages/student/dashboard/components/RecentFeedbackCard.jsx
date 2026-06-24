import { ArrowRight, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDashboardDate } from "../utils/portfolioScore";
function RecentFeedbackCard({ feedback }) {
  return (
    <section className="dashboard-feedback-card">
      <div className="dashboard-card-header">
        <h2>Recent Feedback</h2>
        <Link to="/feedback" className="dashboard-view-link">
          View
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      {feedback.length === 0 ? (
        <div className="dashboard-feedback-empty">
          <MessageSquareText aria-hidden="true" />
          <p>No feedback yet</p>
          <span>Coach feedback will appear in the Feedback tab</span>
        </div>
      ) : (
        <div className="dashboard-feedback-list">
          {feedback.map((item, index) => (
            <article className="dashboard-feedback-item" key={`${item.projectTitle}-${index}`}>
              <div className="dashboard-feedback-icon">
                <MessageSquareText aria-hidden="true" />
              </div>

              <div>
                <div className="dashboard-feedback-top">
                  <strong>{item.projectTitle}</strong>
                  <span>{formatDashboardDate(item.createdAt)}</span>
                </div>
                <p>{item.message}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentFeedbackCard;
