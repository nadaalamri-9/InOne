import "./CTASection.css";
import CTA from "../../../assets/CTA.svg";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-bg-shape"></div>
      <div className="section-container">
        <div className="cta-wrapper">
          <div className="cta-content">
            <h2>Ready to build your professional portfolio?</h2>
            <p>Join Us and showcase your talent to the world.</p>
            <div className="cta-buttons">
              <Link to="/signup"><Button variant="primary">Create Your Portfolio</Button></Link>
              <Link to="/portfolios"><Button variant="secondary">Explore Portfolios</Button></Link>
            </div>
          </div>
          <div className="cta-image"><img src={CTA} alt="CTA Illustration" /></div>
        </div>
      </div>
    </section>
  );
}
export default CTASection;
