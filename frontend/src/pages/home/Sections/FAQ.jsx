import { useState } from "react";
import { Plus, Minus } from "lucide-react";
const faqs = [
  {
    question: "What is InOne?",
    answer:
      "InOne is a student portfolio platform that brings resumes, projects, GitHub, LinkedIn, and achievements together in one professional profile.",
  },
  {
    question: "Who can use InOne?",
    answer:
      "Students, career coaches, employers, and academic institutions can use InOne to showcase and discover talent.",
  },
  {
    question: "Can I share my portfolio publicly?",
    answer:
      "Yes. Every portfolio can be shared through a single professional link.",
  },
  {
    question: "Can employers browse portfolios?",
    answer:
      "Yes. Employers can explore student portfolios, projects, skills, and achievements from one place.",
  },
  {
    question: "Is InOne free for students?",
    answer:
      "Yes. Students can create and manage their portfolios without complicated setup.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="FAQ" className="faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="faq-kicker">FAQ</span>

          <h2>
            Frequently Asked
            <span> Questions</span>
          </h2>

          <p>Everything you need to know about using InOne.</p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${open === index ? "active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span>{item.question}</span>
                {open === index ? <Minus size={18} /> : <Plus size={18} />}
              </button>

              {open === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}