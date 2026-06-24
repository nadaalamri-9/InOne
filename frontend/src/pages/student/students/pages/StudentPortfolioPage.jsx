import { useParams } from "react-router-dom";

import { buildPortfolioData } from "../../portfolio/data/portfolioData";
import PortfolioPage from "../../portfolio/pages/PortfolioPage";
import PrivatePortfolio from "../../portfolio/components/PrivatePortfolio";
import { useStudentRaw } from "../hooks/useStudentRaw";

const centered = { padding: "60px 20px", textAlign: "center", color: "var(--muted)", fontWeight: 700 };

// Viewing another student's full portfolio. Same design as /portfolio:
// full-screen (no sidebar, because the path starts with /portfolio).
function StudentPortfolioPage() {
  const { studentId } = useParams();
  const { student, loading, notFound } = useStudentRaw(studentId);

  if (loading) return <div style={centered}>Loading portfolio...</div>;
  if (notFound || !student) return <div style={centered}>This student could not be found.</div>;

  // Private profile: show the existing "this portfolio is private" gate.
  if (student.visibility !== "public") return <PrivatePortfolio name={student.name} photoUrl={student.photoUrl || student.photo_url} />;

  const portfolio = buildPortfolioData({ profile: student, projects: student.projects });

  return (
    <PortfolioPage
      profile={portfolio}
      viewer={{ role: "student" }}
      projectBasePath={`/portfolio/student/${student.id}/project`}
    />
  );
}

export default StudentPortfolioPage;
