import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import m2 from "../../../assets/m2.svg";
export default function CTASection() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("currentUser"));

  return (
    <section className="cta-section">
      <div className="container cta-inner">

        <div className="cta-image">
          <img
            src={m2}
            alt="InOne Portfolio"
          />
        </div>

        <div className="cta-content">
          <span className="cta-kicker">
            GET STARTED
          </span>

          <h2>
            Ready to build your
            <span> portfolio?</span>
          </h2>

          <p>
            Organize your projects, skills, resume, and
            achievements in one professional portfolio.
          </p>

          {!isLoggedIn && (
            <Button
              onClick={() => navigate("/signup")}
            >
              Create My Portfolio
            </Button>
          )}

        </div>

      </div>
    </section>
  );
}