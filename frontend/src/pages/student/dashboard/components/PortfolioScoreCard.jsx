import { Clock3, ShieldCheck, Sprout, Trophy } from "lucide-react";

const STATUS_CONFIG = {
  "Getting Started": {
    icon: Sprout,
    className: "status-started",
  },
  "In Progress": {
    icon: Clock3,
    className: "status-progress",
  },
  Strong: {
    icon: ShieldCheck,
    className: "status-strong",
  },
  Excellent: {
    icon: Trophy,
    className: "status-excellent",
  },
};

function getStatusConfig(level) {
  return STATUS_CONFIG[level] || STATUS_CONFIG["Getting Started"];
}

function clampProgress(value) {
  return Math.max(0, Math.min(Number(value) || 0, 100));
}

function PortfolioScoreCard({ score = {}, level = "Getting Started" }) {
  const status = getStatusConfig(level);
  const StatusIcon = status.icon;

  const personalInformation = Math.min(score.personalInformation ?? score.profile ?? 0, score.personalInformationMax ?? score.profileMax ?? 9);
  const personalInformationMax = score.personalInformationMax ?? 9;

  const skills = Math.min(score.skills ?? 0, score.skillsMax ?? 10);
  const skillsMax = score.skillsMax ?? 10;

  const projects = Math.min(score.projectsAdded ?? 0, score.targetProjects ?? 6);
  const targetProjects = score.targetProjects ?? 6;

  const scoreRows = [
    {
      key: "overall",
      label: "Overall",
      value: score.overall ?? 0,
      display: `${score.overall ?? 0}/100`,
    },
    {
      key: "personal-information",
      label: "Personal Information",
      value: score.personalInformationPercent ?? score.profilePercent ?? 0,
      display: `${personalInformation}/${personalInformationMax}`,
    },
    {
      key: "skills",
      label: "Skills",
      value: score.skillsPercent ?? 0,
      display: `${skills}/${skillsMax}`,
    },
    {
      key: "projects",
      label: "Projects",
      value: score.projectsAddedPercent ?? 0,
      display: `${projects}/${targetProjects}`,
    },
  ];

  return (
    <section className="dashboard-score-card">
      <div className="dashboard-score-header">
        <div>
          <h2>Portfolio Strength</h2>
          <div className={`dashboard-score-status ${status.className}`}>
            <StatusIcon size={16} strokeWidth={2.4} aria-hidden="true" />
            <span>{level}</span>
          </div>
        </div>

        <strong>{score.overall ?? 0}%</strong>
      </div>

      <div className="dashboard-score-divider" />

      <div className="dashboard-score-list">
        {scoreRows.map((row) => (
          <div className="dashboard-score-row" key={row.key}>
            <div className="dashboard-score-row-top">
              <span>{row.label}</span>
              <b>{row.display}</b>
            </div>

            <div className="dashboard-score-track">
              <div
                className="dashboard-score-fill"
                style={{ width: `${clampProgress(row.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PortfolioScoreCard;
