function DashboardStatCard({ icon: Icon, title, value, tone = "pink" }) {
  return (
    <article className={`dashboard-stat-card stat-${tone}`}>
      <div className="dashboard-stat-icon">
        <Icon aria-hidden="true" />
      </div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default DashboardStatCard;
