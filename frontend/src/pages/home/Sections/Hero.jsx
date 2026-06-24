import { MoveUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import pic1 from "../../../assets/pic1.svg";
import pic2 from "../../../assets/pic2.svg";
import pic3 from "../../../assets/pic3.svg";
import pic4 from "../../../assets/pic4.svg";
import pic5 from "../../../assets/pic5.svg";

const cards = [
  { image: pic1 },
  { image: pic2 },
  { image: pic3 },
  { image: pic4 },
  { image: pic5 },
];

export default function Hero() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("currentUser"));

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-label">
          <Sparkles size={14} />
          Student Portfolio Showcase
        </p>

        <h1>
          Showcase Everything.
          <br />
          In<span className="gradient-word">One Powerful</span> Portfolio.
        </h1>

        <p className="hero-text">
          One link. One portfolio. Endless opportunities.
        </p>

        {!isLoggedIn && (
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        )}
      </div>

      <div className="cards-stage">
        {cards.map((card, index) => (
          <div className={`hero-card card-${index}`} key={index}>
            <div className="card-arrow">
              <MoveUpRight size={18} strokeWidth={2.5} />
            </div>

            <img src={card.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}