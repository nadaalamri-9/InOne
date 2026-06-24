import {
  UserPlus,
  FileText,
  FolderGit2,
  Share2,
  BriefcaseBusiness,
} from "lucide-react";
const steps = [
  {
    number: "01",
    title: "Create profile",
    text: "Add your basic information and career direction.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Add resume",
    text: "Organize your resume in a clean format.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Show projects",
    text: "Highlight your best work and achievements.",
    icon: FolderGit2,
  },
  {
    number: "04",
    title: "Share one link",
    text: "Connect GitHub, LinkedIn, and portfolio links.",
    icon: Share2,
  },
  {
    number: "05",
    title: "Get discovered",
    text: "Make it easier for others to explore your work.",
    icon: BriefcaseBusiness,
  },
];

export default function HowItWorks() {
  return (
    <section id="HOW" className="steps-section">
      <div className="container steps-inner">
        <div className="steps-content">
          <span className="steps-kicker">HOW IT WORKS</span>

          <h2>
            Build your portfolio 
            <br />
            in
            <span> five steps</span>
          </h2>

          <p>
            InOne helps students turn scattered career assets into one
            organized professional portfolio.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div className="step-item" key={step.number}>
                <strong>{step.number}</strong>

                <h3>{step.title}</h3>

                <p>{step.text}</p>

                <Icon size={28} strokeWidth={2.4} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}