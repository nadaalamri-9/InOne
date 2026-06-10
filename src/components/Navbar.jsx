import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.svg";
import Button from "./Button";

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="InOne Logo" />
        </Link>

        {isHomePage && (
          <div className="navbar-links">
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href="#audience">Who it's for</a>
            <a href="#faq">FAQ</a>
          </div>
        )}

        <div className="navbar-actions">
          <Link to="/login">
            <Button variant="primary">Log In</Button>
          </Link>

          <Link to="/signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;