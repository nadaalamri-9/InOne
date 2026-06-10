import { useEffect, useRef, useState } from "react";
import "./CTASection.css";
import CTA from "../../../assets/CTA.svg";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";

function CTASection() {
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
      ref={sectionRef}
      className={`cta-section ${isVisible ? "show" : ""}`}
    >
      <div className="cta-bg-shape"></div>

      <div className="section-container">
        <div className="cta-wrapper">
          <div className="cta-content">
            <h2>Ready to build your professional portfolio?</h2>
            <p>Join us and showcase your talent to the world.</p>

            <div className="cta-buttons">
              <Link to="/signup">
                <Button variant="primary">Create Your Portfolio</Button>
              </Link>

              <Link to="/portfolios">
                <Button variant="secondary">Explore Portfolios</Button>
              </Link>
            </div>
          </div>

          <div className="cta-image">
            <img src={CTA} alt="CTA Illustration" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;