import { useEffect, useRef, useState } from "react";
import "./WorkflowSection.css";
import WorkflowStep from "../../../components/WorkflowStep";
import User from "../../../assets/User.svg";
import Folder from "../../../assets/Folder.svg";
import Note from "../../../assets/Note.svg";
import CheckCircle from "../../../assets/CheckCircle.svg";
import LinkIcon from "../../../assets/Link.svg";

const steps = [
  {
    number: "1",
    icon: User,
    title: "Create profile",
    text: "Add your bio, skills, education and bootcamps.",
  },
  {
    number: "2",
    icon: Folder,
    title: "Add projects",
    text: "Use our structured template with results.",
  },
  {
    number: "3",
    icon: Note,
    title: "Upload resume",
    text: "PDF or Word, employers can download it.",
  },
  {
    number: "4",
    icon: CheckCircle,
    title: "Get reviewed",
    text: "Career coach reviews and approves.",
  },
  {
    number: "5",
    icon: LinkIcon,
    title: "Share & get hired",
    text: "Share your link and impress employers.",
  },
];

function WorkflowSection() {
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
      id="workflow"
      ref={sectionRef}
      className={`workflow-section ${isVisible ? "show" : ""}`}
    >
      <div className="section-container">
        <div className="workflow-header">
          <span>How it works</span>
          <h2>From signing up to a job opportunity</h2>
          <p>
            Five simple steps to get your portfolio live and in front of
            employers.
          </p>
        </div>

        <div className="workflow-timeline">
          {steps.map((step, index) => (
            <WorkflowStep
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              text={step.text}
              isLast={index === steps.length - 1}
              delay={index * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;