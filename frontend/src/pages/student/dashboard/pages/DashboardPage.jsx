import DashboardHeader from "../components/DashboardHeader";
import DashboardStatsGrid from "../components/DashboardStatsGrid";
import PortfolioScoreCard from "../components/PortfolioScoreCard";
import ProjectsOverviewCard from "../components/ProjectsOverviewCard";
import ShareableLinkCard from "../components/ShareableLinkCard";
import ResumeSummaryCard from "../components/ResumeSummaryCard";
import RecentFeedbackCard from "../components/RecentFeedbackCard";
import { useDashboardData } from "../hooks/useDashboardData";
function DashboardPage({ profile }) {
  const {
    profile: dashboardProfile,
    recentProjects,
    recentFeedback,
    score,
    level,
    statusCounts,
    feedbackCount,
    portfolioViews,
    collaboratorsCount,
    loading,
    error,
  } = useDashboardData(profile);

  if (loading) {
    return (
      <div className="dashboard-page">
        <DashboardHeader profile={dashboardProfile} />
        <div className="dashboard-loading-card">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <DashboardHeader profile={dashboardProfile} />
        <div className="dashboard-loading-card dashboard-error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader profile={dashboardProfile} />

      <DashboardStatsGrid
        projectsCount={statusCounts.total}
        portfolioViews={portfolioViews}
        collaboratorsCount={collaboratorsCount}
        feedbackCount={feedbackCount}
      />

      <div className="dashboard-main-grid">
        <div className="dashboard-left-column">
          <ProjectsOverviewCard projects={recentProjects} statusCounts={statusCounts} />
          <ResumeSummaryCard profile={dashboardProfile} />
          <ShareableLinkCard profile={dashboardProfile} />
        </div>

        <div className="dashboard-right-column">
          <PortfolioScoreCard score={score} level={level} />
          <RecentFeedbackCard feedback={recentFeedback} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
