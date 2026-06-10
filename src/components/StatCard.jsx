import "./StatCard.css";

function StatCard({ number, title }) {
  return (
    <div className="stat-card">
      <h3>{number}</h3>
      <p>{title}</p>
    </div>
  );
}

export default StatCard;