import { Code2, User } from "lucide-react";
function AboutSection({ profile }) {
  const aboutText = profile.student?.aboutMe || "";
  const hasAbout = Boolean(aboutText);
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <section className="about-skills-panel" id="about">
      <div className="about-column">
        <div className="section-title-row">
          <span className="section-icon-box">
            <User className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2>About Me</h2>
        </div>
        {hasAbout ? (
          <p className="portfolio-about-text">{aboutText}</p>
        ) : (
          <div className="portfolio-empty-slot">No about me yet</div>
        )}
      </div>

      <div className="skills-column" id="skills">
        <div className="section-title-row">
          <span className="section-icon-box">
            <Code2 className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2>Skills</h2>
        </div>
        {skills.length > 0 ? (
          <div className="portfolio-tag-list">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        ) : (
          <div className="portfolio-empty-slot">No skills yet</div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
