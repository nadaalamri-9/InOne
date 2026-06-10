import { useEffect, useRef, useState } from "react";
import "./FeaturesSection.css";
import Card from "../../../components/Card";
import User from "../../../assets/User.svg";
import Folder from "../../../assets/Folder.svg";
import Note from "../../../assets/Note.svg";
import LinkIcon from "../../../assets/Link.svg";
import CheckCircle from "../../../assets/CheckCircle.svg";
import UsersThree from "../../../assets/UsersThree.svg";

const features = [
  {
    icon: User,
    title: "Professional Portfolio",
    text: "Photo, bio, skills, education, bootcamps and target roles all in one structured page.",
  },
  {
    icon: Folder,
    title: "Structured Projects",
    text: "Showcase each project with clear problem, solution, architecture, and results.",
  },
  {
    icon: Note,
    title: "Resume Upload",
    text: "Upload and manage your resume so employers can download it easily.",
  },
  {
    icon: LinkIcon,
    title: "Shareable Link",
    text: "Generate a secure link to share your portfolio with employers.",
  },
  {
    icon: CheckCircle,
    title: "Coach Review & Feedback",
    text: "Career coaches review each project and give feedback before it goes live to employers.",
  },
  {
    icon: UsersThree,
    title: "Team Collaboration",
    text: "Share group projects, team assignments, and collaborative work.",
  },
];

function FeaturesSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    
        <section
          id="features"
          className={`features-section ${isVisible ? "show" : ""}`}
          ref={sectionRef}
        >
      <div className="section-container">
        <div className="features-header">
          <span>Features</span>
          <h2>Everything you need to stand out</h2>
          <p>
            Designed to help WeCloudData graduates showcase their skills and
            stand out.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card-wrap"
              style={{ transitionDelay: `${index * 0.1}s` }}
              key={feature.title}
            >
              <Card>
                <div className="feature-icon">
                  <img src={feature.icon} alt={feature.title} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;