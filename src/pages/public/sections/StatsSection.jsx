import "./StatsSection.css";
import StatCard from "../../../components/StatCard";

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <StatCard number="50+" title="Projects showcased" />
        </div>

        <div className="stat-item">
          <StatCard number="20+" title="WeCloudData graduates" />
        </div>

        <div className="stat-item">
          <StatCard number="100%" title="Structured portfolios" />
        </div>
      </div>
    </section>
  );
}

export default StatsSection;