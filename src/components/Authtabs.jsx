import { Link, useLocation } from "react-router-dom";
import "./Authtabs.css";

function Authtabs() {
  const { pathname } = useLocation();
  const isSignup = pathname.includes("signup");

  return (
    <div className={`auth-tabs ${isSignup ? "signup-active" : ""}`}>
      <div className="auth-tabs-slider"></div>
      <Link to="/login" className={`auth-tab ${!isSignup ? "active" : ""}`}>Log In</Link>
      <Link to="/signup" className={`auth-tab ${isSignup ? "active" : ""}`}>Sign Up</Link>
    </div>
  );
}

export default Authtabs;
