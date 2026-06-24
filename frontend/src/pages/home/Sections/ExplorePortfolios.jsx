import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import m1 from "../../../assets/m1.svg";
export default function ExplorePortfolios() {
  const navigate = useNavigate();

  return (
    <section id="PORTFOLIOS" className="explore-section">
      <div className="container explore-inner">

        <div className="explore-image">
          <img
            src={m1}
            alt="Student Portfolio"
          />
        </div>

        <div className="explore-content">
          <span className="explore-kicker">
            EXPLORE PORTFOLIOS
          </span>

          <h2>
            Discover talented students through
            <span> InOne</span>
          </h2>

          <p>
            Discover projects, skills, resumes, and achievements
            through professional student portfolios.
          </p>

          <Button onClick={() => navigate("/portfolios")}>
            Explore Portfolios
            <ArrowRight size={18} />
          </Button>

        </div>

      </div>
    </section>
  );
}