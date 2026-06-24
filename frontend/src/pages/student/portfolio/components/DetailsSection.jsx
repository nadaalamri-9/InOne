import { Award, Check, GraduationCap } from "lucide-react";
function DetailsSection({ profile }) {
  const education = Array.isArray(profile.education) ? profile.education : [];
  const certifications = Array.isArray(profile.certifications) ? profile.certifications : [];

  return (
    <section className="portfolio-details-grid" id="education">
      <div className="detail-card education-card">
        <div className="section-title-row">
          <span className="section-icon-box">
            <GraduationCap className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2>Education</h2>
        </div>

        {education.length > 0 ? (
          <div className="education-timeline">
            {education.map((item) => (
              <article className="timeline-item" key={`${item.school}-${item.degree}-${item.date}`}>
                <span className="timeline-dot" />
                <span className="timeline-school-icon">
                  <GraduationCap className="portfolio-icon" size={18} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <div className="timeline-content">
                  {(item.degree || item.school) && <h3>{item.degree || item.school}</h3>}
                  {item.school && <p>{item.school}</p>}
                </div>
                {item.date && <small className="timeline-date">{item.date}</small>}
              </article>
            ))}
          </div>
        ) : (
          <div className="portfolio-empty-slot">No education yet</div>
        )}
      </div>

      <div className="detail-card certification-card">
        <div className="section-title-row">
          <span className="section-icon-box">
            <Award className="portfolio-icon" size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2>Certifications & Bootcamps</h2>
        </div>

        {certifications.length > 0 ? (
          <div className="certificate-list">
            {certifications.map((certification) => {
              const name = typeof certification === "string" ? certification : certification.name;
              const year = typeof certification === "string" ? "" : certification.year;

              return (
                <span key={`${name}-${year}`}>
                  <Check className="portfolio-icon" size={16} strokeWidth={2.2} aria-hidden="true" />
                  <strong>{name}</strong>
                  {year && <small>{year}</small>}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="portfolio-empty-slot">No certifications yet</div>
        )}
      </div>
    </section>
  );
}

export default DetailsSection;
