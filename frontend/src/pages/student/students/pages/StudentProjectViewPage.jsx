import { useParams } from "react-router-dom";

import ProjectShell from "../../projects/pages/ProjectViewPage/components/ProjectShell";
import PrivatePortfolio from "../../portfolio/components/PrivatePortfolio";
import { ProjectViewContent } from "../../projects/pages/ProjectViewPage";
import { normalizeProjectFromApi } from "../../projects/services/projectApi";
import { useStudentRaw } from "../hooks/useStudentRaw";

const centered = { padding: "60px 20px", textAlign: "center", color: "var(--muted)", fontWeight: 700 };

// One project from a student's portfolio, wrapped in a separate ProjectShell.
function StudentProjectViewPage() {
  const { studentId, projectId } = useParams();
  const { student, loading, notFound } = useStudentRaw(studentId);

  if (loading) return <div style={centered}>Loading project...</div>;
  if (notFound || !student) return <div style={centered}>This student could not be found.</div>;
  if (student.visibility !== "public") return <PrivatePortfolio name={student.name} photoUrl={student.photoUrl || student.photo_url} />;

  const rawProject = (student.projects || []).find(
    (project) => String(project.id) === String(projectId)
  );
  if (!rawProject) return <div style={centered}>This project could not be found.</div>;

  const project = normalizeProjectFromApi(rawProject);

  return (
    <ProjectShell project={project}>
      <ProjectViewContent project={project} isPublicView backTo={`/portfolio/student/${student.id}`} />
    </ProjectShell>
  );
}

export default StudentProjectViewPage;
