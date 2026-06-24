import Card from "../../../components/Card";
export default function Stats() {
  return (
    <section id="IMPACT" className="stats-section">
      <div className="container stats-inner">
        <div className="stats-content">
          <span className="stats-kicker">INONE IMPACT</span>

          <h2>
            Why students
            <br />
            choose <span>InOne</span>
          </h2>

          <p>
            A smarter way to organize projects, resumes, GitHub profiles and
            achievements in one professional portfolio.
          </p>
        </div>

        <div className="stats-grid">
          <Card variant="gradient" padding="lg" hover className="stat-card">
            <span className="stat-number">50+</span>
            <p className="stat-label">Projects showcased</p>
          </Card>

          <Card variant="gradient" padding="lg" hover className="stat-card">
            <span className="stat-number">20+</span>
            <p className="stat-label">WeCloudData graduates</p>
          </Card>

          <Card variant="gradient" padding="lg" hover className="stat-card">
            <span className="stat-number">100%</span>
            <p className="stat-label">Structured portfolios</p>
          </Card>

          <Card variant="gradient" padding="lg" hover className="stat-card">
            <span className="stat-number">1</span>
            <p className="stat-label">Smart portfolio link</p>
          </Card>
        </div>
      </div>
    </section>
  );
}