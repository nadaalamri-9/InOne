import "./AudienceSection.css";
import Card    from "../../../components/Card";
import student  from "../../../assets/student.svg";
import employer from "../../../assets/employer.svg";
import coach    from "../../../assets/coach.svg";

const audience = [
  { icon:student,  title:"Students",       description:"Build a professional portfolio and stand out to employers with structured, coach-approved projects." },
  { icon:employer, title:"Employers",      description:"Find the right talent fast with Skills Match. Review projects, download resumes, contact students directly." },
  { icon:coach,    title:"Career Coaches", description:"Review student portfolios, provide per project feedback and publish approved portfolios." },
];

function AudienceSection() {
  return (
    <section className="audience-section">
      <div className="section-container">
        <div className="audience-header">
          <span>Who it's for</span>
          <h2>Built for the WeCloudData community</h2>
          <p>This platform connects you all.</p>
        </div>
        <div className="audience-grid">
          {audience.map(a => (
            <Card key={a.title}>
              <div className="audience-card-icon"><img src={a.icon} alt={a.title} /></div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default AudienceSection;
