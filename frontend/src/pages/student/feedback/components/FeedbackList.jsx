import { MessageSquareText } from "lucide-react";

import FeedbackRow from "./FeedbackRow";
function FeedbackList({ loading, error, items, onView }) {
  return (
    <section className="feedback-list-card">
      <div className="feedback-card-header">
        <div>
          <h2>All feedback</h2>
          <p>Newest comments appear first.</p>
        </div>
      </div>

      {loading ? (
        <div className="feedback-state-card">Loading feedback...</div>
      ) : error ? (
        <div className="feedback-state-card feedback-error-card">{error}</div>
      ) : items.length ? (
        <div className="feedback-table" role="list">
          {items.map((item) => (
            <FeedbackRow key={item.id} item={item} onView={onView} />
          ))}
        </div>
      ) : (
        <div className="feedback-empty-card">
          <MessageSquareText aria-hidden="true" />
          <h3>No feedback yet</h3>
          <p>Coach feedback will appear here after your projects are reviewed.</p>
        </div>
      )}
    </section>
  );
}

export default FeedbackList;
