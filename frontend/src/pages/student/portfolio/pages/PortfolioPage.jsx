import { useEffect, useState } from "react";
import PortfolioShell from "../components/PortfolioShell.jsx";
import HeroSection from "../components/HeroSection.jsx";
import AboutSection from "../components/AboutSection.jsx";
import TargetRolesSection from "../components/TargetRolesSection.jsx";
import ProjectsSection from "../components/ProjectsSection.jsx";
import DetailsSection from "../components/DetailsSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import PrivatePortfolio from "../components/PrivatePortfolio.jsx";
import { buildPortfolioData, loadPortfolioDataFromApi, viewerContext } from "../data/portfolioData.js";

function canViewPortfolio(profile, viewer) {
  const visibility = profile?.privacy?.visibility || "private";
  if (visibility === "public") return true;
  if (viewer.role === "owner" || viewer.role === "coach") return true;
  if (viewer.role === "employer" && viewer.hasPrivateToken) return true;
  return false;
}

function PortfolioPage({ viewer = viewerContext, profile: profileProp = null, projectBasePath }) {
  const [portfolio, setPortfolio] = useState(profileProp || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileProp) {
      setPortfolio(profileProp);
      setLoading(false);
      return;
    }

    loadPortfolioDataFromApi()
      .then((data) => setPortfolio(data))
      .catch(() => setPortfolio(buildPortfolioData({})))
      .finally(() => setLoading(false));
  }, [profileProp]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
        <span style={{ color: "#6b7280" }}>Loading portfolio…</span>
      </div>
    );
  }

  if (!portfolio) return null;

  const fullName = portfolio.student?.fullName || `${portfolio.student?.firstName || ""} ${portfolio.student?.lastName || ""}`.trim();

  if (!canViewPortfolio(portfolio, viewer)) {
    return (
      <PrivatePortfolio
        name={fullName}
        photoUrl={portfolio.student?.photoUrl}
        avatarInitials={portfolio.student?.avatarInitials}
      />
    );
  }

  return (
    <PortfolioShell profile={portfolio}>
      <HeroSection profile={portfolio} />
      <TargetRolesSection profile={portfolio} />
      <AboutSection profile={portfolio} />
      <DetailsSection profile={portfolio} />
      <ProjectsSection projects={portfolio.projects} profile={portfolio} projectBasePath={projectBasePath} />
      <ContactSection profile={portfolio} />
    </PortfolioShell>
  );
}

export default PortfolioPage;
