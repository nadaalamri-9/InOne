import { Award, Briefcase, Code2, Download, Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import profilePic from "../../../../assets/ProfilePic.svg";
import LinkedIn from "../../../../assets/Linkedin.svg";
import GitHub from "../../../../assets/GitHub.svg";
import WebSite from "../../../../assets/WebSite.svg";
const socialIcons = {
  linkedin: LinkedIn,
  github: GitHub,
  website: WebSite,
};

const statItems = [
  { key: "projects", label: "Projects", Icon: Briefcase },
  { key: "certifications", label: "Certification", Icon: Award },
  { key: "skills", label: "Skills", Icon: Code2 },
];

function HeroSection({ profile }) {
  const { student, socialLinks, projects, certifications, skills, resume } = profile;
  const fullName =
    student.fullName || `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Your Name";
  const avatarSrc = student.photoUrl || profilePic;
  const links = Object.entries(socialLinks || {}).filter(([, url]) => Boolean(url));
  const roleLine = student.title || student.role || "";
  const headlineLine =
    student.headline && student.headline !== roleLine
      ? student.headline
      : student.role && student.role !== roleLine
        ? student.role
        : "";
  const stats = {
    projects: `${projects?.length || 0}+`,
    certifications: `${certifications?.length || 0}+`,
    skills: `${skills?.length || 0}+`,
  };

  return (
    <section className="portfolio-hero" id="top">
      <div className="hero-copy">
        <p className="hero-kicker">Hey there, It’s</p>
        <h1 className={!student.fullName && !student.firstName && !student.lastName ? "hero-empty-name" : ""}>
          {fullName}
        </h1>
        {(roleLine || headlineLine) && (
          <div className="hero-role-block">
            {roleLine && <p className="hero-role-text">{roleLine}</p>}
            {headlineLine && <p className="hero-headline-text">{headlineLine}</p>}
          </div>
        )}

        {student.bio && (
          <p className="hero-description">{student.bio}</p>
        )}

        {(resume?.url || student.email) && (
          <div className="hero-actions">
            {resume?.url && (
              <a className="hero-btn hero-btn-primary" href={resume.url} download>
                Download CV
                <Download className="portfolio-icon" size={18} strokeWidth={2.2} aria-hidden="true" />
              </a>
            )}
            {student.email && (
              <a className="hero-btn hero-btn-secondary" href={`mailto:${student.email}`}>
                Contact ME
                <Mail className="portfolio-icon" size={18} strokeWidth={2.2} aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {(student.location || student.phone) && (
          <div className="hero-info-row">
            {student.location && (
              <span className="hero-info-card hero-info-location">
                <MapPin className="portfolio-icon" size={21} strokeWidth={2.2} aria-hidden="true" />
                {student.location}
              </span>
            )}

            {student.phone && (
              <span className="hero-info-card hero-info-phone">
                <Phone className="portfolio-icon" size={21} strokeWidth={2.2} aria-hidden="true" />
                {student.phone}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="hero-visual">
        <div className="hero-photo-arch">
          <img src={avatarSrc} alt={fullName || "Profile"} />
        </div>

        <div className="hero-stats-card">
          {statItems.map(({ key, label, Icon }) => (
            <div className="hero-stat-item" key={key}>
              <span>
                <Icon className="portfolio-icon" size={24} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div>
                <small>{label}</small>
                <strong>{stats[key]}</strong>
              </div>
            </div>
          ))}
        </div>

        {links.length > 0 && (
          <div className="hero-social-row" aria-label="Social links">
            {links.map(([name, url]) => {
              const iconSrc = socialIcons[name];

              return (
                <a href={url} key={name} target="_blank" rel="noreferrer" aria-label={name}>
                  {iconSrc ? (
                    <img src={iconSrc} alt="" aria-hidden="true" />
                  ) : (
                    <LinkIcon className="portfolio-icon" size={22} strokeWidth={2.2} aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
