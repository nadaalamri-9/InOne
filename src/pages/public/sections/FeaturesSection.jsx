import "./FeaturesSection.css";
import Card from "../../../components/Card";
import User        from "../../../assets/User.svg";
import Folder      from "../../../assets/Folder.svg";
import Note        from "../../../assets/Note.svg";
import LinkIcon    from "../../../assets/Link.svg";
import CheckCircle from "../../../assets/CheckCircle.svg";
import UsersThree  from "../../../assets/UsersThree.svg";

const features = [
  { icon: User,        title: "Professional Portfolio",    text: "Photo, bio, skills, education, bootcamps and target roles  all in one structured page." },
  { icon: Folder,      title: "Structured Projects",       text: "Showcase each project with clear problem, solution, architecture, and results." },
  { icon: Note,        title: "Resume Upload",             text: "Upload and manage your resume so employers can download it easily." },
  { icon: LinkIcon,    title: "Shareable Link",            text: "Generate a secure link to share your portfolio with employers." },
  { icon: CheckCircle, title: "Coach review & feedback",   text: "Career coaches review each project and give feedback before it goes live to employers." },
  { icon: UsersThree,  title: "Team Collaboration",        text: "Share group projects, team assignments, and collaborative work." },
];

function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="section-container">
        <div className="features-header">
          <span>Features</span>
          <h2>Everything you need to stand out</h2>
          <p>Designed to help WeCloudData graduates showcase their skills and stand out.</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <Card key={f.title}>
              <div className="feature-icon"><img src={f.icon} alt={f.title} /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeaturesSection;
