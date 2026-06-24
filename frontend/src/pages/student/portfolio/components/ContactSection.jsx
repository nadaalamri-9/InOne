import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
function ContactSection({ profile }) {
  const { student } = profile;
  const hasContact = Boolean(student.email || student.phone || student.location);

  return (
    <section className="connect-card" id="contact">
      <div className="connect-intro">
        <div className="section-title-row connect-title-row">
          <span className="connect-icon">
            <ExternalLink className="portfolio-icon" size={30} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2>Let’s Connect</h2>
        </div>
        <p>Interested in collaborating, creating impactful projects, or discussing new opportunities.</p>
      </div>

      {hasContact ? (
        <div className="connect-methods">
          {student.email && (
            <a href={`mailto:${student.email}`} className="connect-method connect-method-email">
              <Mail className="portfolio-icon" size={26} strokeWidth={2.2} aria-hidden="true" />
              <span>
                <strong>Email</strong>
                <small>{student.email}</small>
              </span>
            </a>
          )}
          {student.phone && (
            <a href={`tel:${student.phone}`} className="connect-method connect-method-phone">
              <Phone className="portfolio-icon" size={26} strokeWidth={2.2} aria-hidden="true" />
              <span>
                <strong>Phone</strong>
                <small>{student.phone}</small>
              </span>
            </a>
          )}
          {student.location && (
            <span className="connect-method connect-method-location">
              <MapPin className="portfolio-icon" size={26} strokeWidth={2.2} aria-hidden="true" />
              <span>
                <strong>Location</strong>
                <small>{student.location}</small>
              </span>
            </span>
          )}
        </div>
      ) : (
        <div className="portfolio-empty-slot connect-empty-slot">No contact information yet</div>
      )}
    </section>
  );
}

export default ContactSection;
