import "./HeroSection.css";
import hero1 from "../../../assets/hero1.svg";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg-shape"></div>
      <div className="section-container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h2>
              Showcase Your Skills,
              <div className="pink-line"></div>
              <span>Get Discovered.</span>
            </h2>
            <p>WeCloudData Portfolio helps graduates showcase real projects, build a professional presence, and connect with employers.</p>
            <div className="hero-buttons">
              <Link to="/signup"><Button variant="primary">Create Your Portfolio</Button></Link>
              <Link to="/portfolios"><Button variant="secondary">Explore Portfolios</Button></Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={hero1} alt="Hero Illustration" />
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
