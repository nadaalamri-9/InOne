import {
  Eye,
  FolderKanban,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";
function DashboardStatsGrid({
  projectsCount,
  portfolioViews,
  collaboratorsCount,
  feedbackCount,
}) {
  return (
    <section className="dashboard-stats-grid" aria-label="Dashboard summary">
      <DashboardStatCard
        icon={FolderKanban}
        title="Projects"
        value={projectsCount}
        tone="pink"
      />
      <DashboardStatCard
        icon={MessageSquareText}
        title="Feedback Items"
        value={feedbackCount}
        tone="pink"
      />
      <DashboardStatCard
        icon={Eye}
        title="Portfolio Views"
        value={portfolioViews}
        tone="pink"
      />
      <DashboardStatCard
        icon={UsersRound}
        title="Team Network"
        value={collaboratorsCount}
        tone="pink"
      />
    </section>
  );
}

export default DashboardStatsGrid;
