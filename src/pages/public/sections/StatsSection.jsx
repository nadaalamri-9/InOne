import "./StatsSection.css";
import StatCard from "../../../components/StatCard";
function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <StatCard number="50+" title="Projects showcased" />
        <StatCard number="20+" title="WeCloudData graduates" />
        <StatCard number="100%" title="Structured portfolios" />
      </div>
    </section>
  );
}
export default StatsSection;
