import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.svg";
import Button from "./Button";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo"><img src={logo} alt="InOne Logo" /></div>
        <div className="navbar-actions">
          <Link to="/login"><Button variant="primary">Log In</Button></Link>
          <Link to="/signup"><Button variant="secondary">Sign Up</Button></Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
