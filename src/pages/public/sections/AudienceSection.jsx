import { useEffect, useRef, useState } from "react";
import "./AudienceSection.css";
import Card from "../../../components/Card";
import student from "../../../assets/student.svg";
import employer from "../../../assets/employer.svg";
import coach from "../../../assets/coach.svg";

const audience = [
  {
    icon: student,
    title: "Students",
    description:
      "Build a professional portfolio and stand out to employers with structured, coach-approved projects.",
  },
  {
    icon: employer,
    title: "Employers",
    description:
      "Find the right talent fast with Skills Match. Review projects, download resumes, and contact students directly.",
  },
  {
    icon: coach,
    title: "Career Coaches",
    description:
      "Review student portfolios, provide project feedback, and publish approved portfolios.",
  },
];

function AudienceSection() {
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
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="audience"
      ref={sectionRef}
      className={`audience-section ${isVisible ? "show" : ""}`}
    >
      <div className="section-container">
        <div className="audience-header">
          <span>Who it's for</span>
          <h2>Built for the WeCloudData community</h2>
          <p>This platform connects everyone together.</p>
        </div>

        <div className="audience-grid">
          {audience.map((item, index) => (
            <div
              className="audience-card-wrapper"
              key={item.title}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <Card>
                <div className="audience-card-icon">
                  <img src={item.icon} alt={item.title} />
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AudienceSection;