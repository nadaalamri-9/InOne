import { Link } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, UserCheck } from "lucide-react";

import Footer from "../../components/Footer";
import Card from "../../components/Card";
import logo from "../../assets/logo.svg";
export default function Privacy() {
  return (
    <>
      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link to="/" className="legal-logo">
            <img src={logo} alt="InOne" />
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <section className="container">
          <div className="legal-hero">
            <div className="legal-hero-content">
              <p className="legal-kicker">InOne Privacy</p>

              <h1>Privacy Policy</h1>

              <p>
                Your privacy matters to us. Learn how InOne collects, uses, and
                protects your information while you build and share your
                professional portfolio.
              </p>

              <Link to="/" className="back-home">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>

            <div className="legal-visual">
              <div className="legal-orb" />

              <div className="visual-card">
                <div className="visual-icon">
                  <Lock size={38} />
                </div>

                <div className="visual-line" />
                <div className="visual-line medium" />
                <div className="visual-line small" />

                <div className="floating-badge badge-top">
                  <ShieldCheck size={18} />
                  Protected
                </div>

                <div className="floating-badge badge-bottom">
                  <UserCheck size={18} />
                  Verified
                </div>
              </div>
            </div>
          </div>

          <Card padding="lg" className="legal-card">
            <div className="legal-meta">
              <h2>Privacy Policy</h2>
              <p>Last updated: June 2026</p>
            </div>

            <div className="legal-content legal-grid">
              {[
                [
                  "1. Information We Collect",
                  "We collect account details, profile information, uploaded files, project content, links, and basic usage data.",
                ],
                [
                  "2. How We Use Your Information",
                  "We use your information to create your portfolio, support dashboard features, improve the platform, and help coaches or employers review your work.",
                ],
                [
                  "3. Portfolio Visibility",
                  "Students control what appears on their shareable portfolio link. Public pages may be viewed by anyone with the link.",
                ],
                [
                  "4. Data Protection",
                  "InOne is designed to protect student information and keep account access secure.",
                ],
                [
                  "5. Your Choices",
                  "You can update your profile, edit portfolio content, remove files, and manage what information appears publicly.",
                ],
                [
                  "6. Contact",
                  "For privacy questions, contact the InOne team through the Contact page.",
                ],
              ].map(([title, text]) => (
                <article className="legal-article" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </>
  );
}