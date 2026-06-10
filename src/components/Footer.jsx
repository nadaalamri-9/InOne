import { Link } from "react-router-dom";
import logo from "../assets/logo2.svg";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-logo">
          <img src={logo} alt="InOne" />
        </Link>

        <div className="footer-copy">
          © 2026 InOne. All rights reserved.
        </div>

        <nav className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;