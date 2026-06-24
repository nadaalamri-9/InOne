import { Check, MessageSquare } from "lucide-react";
import PortfolioCard from "./PortfolioCard.jsx";
function FeedbackSection({ feedback }) {
  return (
    <PortfolioCard title="Coach Feedback" eyebrow="Progress" icon="message">
      <div className="feedback-list">
        {feedback.length ? (
          feedback.map((item) => (
            <div className="feedback-item" key={`${item.project}-${item.message}-${item.date}`}>
              <span aria-hidden="true">
                <Check className="portfolio-icon" size={14} strokeWidth={2.2} />
              </span>
              <div>
                {item.project && <strong>{item.project}</strong>}
                <p>{item.message}</p>
                {item.date && <small>{item.date}</small>}
              </div>
            </div>
          ))
        ) : (
          <div className="portfolio-empty-state">
            <MessageSquare className="portfolio-icon" size={42} strokeWidth={2.2} aria-hidden="true" />
            <h3>No feedback yet</h3>
            <p>Coach feedback will appear here once a project is reviewed.</p>
          </div>
        )}
      </div>
    </PortfolioCard>
  );
}

export default FeedbackSection;
