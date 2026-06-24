import { Briefcase, Check, Code2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ProfilePic from "../../../../assets/ProfilePic.svg";
function getMemberPhoto(member = {}, profile = {}) {
  const memberName = String(member.name || member.fullName || "").trim().toLowerCase();
  const memberEmail = String(member.email || "").trim().toLowerCase();
  const student = profile?.student || {};
  const studentName = String(student.fullName || `${student.firstName || ""} ${student.lastName || ""}`).trim().toLowerCase();
  const studentEmail = String(student.email || "").trim().toLowerCase();

  return (
    member.avatar ||
    member.photoPreview ||
    member.photoUrl ||
    member.profileImage ||
    member.imageUrl ||
    member.image ||
    member.picture ||
    ((memberEmail && memberEmail === studentEmail) || (memberName && memberName === studentName)
      ? student.photoUrl
      : "") ||
    ProfilePic
  );
}

function ProjectsSection({ projects, profile, projectBasePath = "/portfolio/project" }) {
  const publishedProjects = (projects || []).filter((project) => project.status === "Published");

  return (
    <section className="spotlight-projects-card" id="projects">
      <div className="section-title-row spotlight-title-row">
        <span className="section-icon-box">
          <Briefcase className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2>Spotlight Projects</h2>
      </div>

      {publishedProjects.length > 0 ? (
        <div className="portfolio-projects-grid">
          {publishedProjects.map((project) => {
            const isTeam = project.type?.toLowerCase().includes("team");
            const members = project.teamMembers || [];
            return (
              <article className="portfolio-project-card" key={project.id || project.title}>
                <Link
                  className="view-project-link"
                  to={`${projectBasePath}/${project.id}`}
                  aria-label={`View ${project.title || "project"}`}
                >
                  View
                  <span aria-hidden="true">→</span>
                </Link>

                <div className="project-image-frame">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt="" />
                  ) : (
                    <div className="project-image-placeholder">
                      <Code2 className="portfolio-icon" size={42} strokeWidth={2.2} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="project-body">
                  <div className="project-heading-row">
                    <h3>{project.title}</h3>
                  </div>

                  {project.summary && <p className="project-summary">{project.summary}</p>}

                  {project.skills.length > 0 && (
                    <div className="project-skills">
                      {project.skills.slice(0, 4).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  )}

                  <div className="project-team-row">
                    <div className="project-team-label">
                      <Users className="portfolio-icon" size={18} strokeWidth={2.2} aria-hidden="true" />
                      <span>TEAM</span>
                    </div>

                    {isTeam && members.length > 0 ? (
                      <div className="project-team-members" aria-label="Team members">
                        <div className="team-avatar-row">
                          {members.slice(0, 3).map((member, index) => (
                            <span key={member.name || member.email || index}>
                              <img
                                src={getMemberPhoto(member, profile)}
                                alt={member.name || member.email || "Team member"}
                              />
                            </span>
                          ))}
                        </div>
                        <strong>{members.length} {members.length === 1 ? "member" : "members"}</strong>
                      </div>
                    ) : (
                      <div className="project-solo-label">
                        <Check className="portfolio-icon" size={16} strokeWidth={2.2} aria-hidden="true" />
                        <strong>Solo project</strong>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="portfolio-empty-state portfolio-projects-empty">
          <h3>No published projects yet</h3>
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
