import logo from "../assets/logo2.svg";
import "./Footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo"><img src={logo} alt="WeCloudData" /></div>
        <nav className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
export default Footer;
