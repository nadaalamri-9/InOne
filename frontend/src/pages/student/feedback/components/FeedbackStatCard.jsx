function FeedbackStatCard({ icon: Icon, label, value }) {
  return (
    <article className="feedback-stat-card">
      <span className="feedback-stat-icon">
        <Icon aria-hidden="true" />
      </span>

      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default FeedbackStatCard;
