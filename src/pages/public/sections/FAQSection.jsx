import { useEffect, useRef, useState } from "react";
import "./FAQSection.css";

const faqs = [
  {
    question: "What is WeCloudData Portfolio?",
    answer:
      "A centralized space for showcasing academic and professional achievements in an organized and professional way.",
  },
  {
    question: "Is it free for students?",
    answer:
      "Yes, students can create and maintain their portfolios completely free of charge.",
  },
  {
    question: "What is the review workflow?",
    answer:
      "After adding your projects, a career coach reviews each one and gives feedback before it goes live.",
  },
  {
    question: "How do I share my portfolio?",
    answer:
      "You have full control over visibility. Keep it private or publish it publicly so anyone with the link can view it.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      id="faq"
      ref={sectionRef}
      className={`faq-section ${isVisible ? "show" : ""}`}
    >
      <div className="section-container">
        <div className="faq-header">
          <span>FAQ</span>
          <h2>Frequently asked questions</h2>
          <p>
            Find answers to the most common questions about building and sharing
            your portfolio.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => toggle(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">+</span>
              </button>

              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;