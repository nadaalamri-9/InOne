import { Link } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, ScrollText } from "lucide-react";

import Footer from "../../components/Footer";
import Card from "../../components/Card";
import logo from "../../assets/logo.svg";
export default function TermsOfService() {
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
              <p className="legal-kicker">InOne Legal</p>

              <h1>Terms of Service</h1>

              <p>
                Understand the rules, responsibilities, and guidelines that keep
                InOne safe, professional, and useful for students, employers,
                and career coaches.
              </p>

              <Link to="/" className="back-home">
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>

            <div className="legal-visual">
              <div className="legal-orb" />

              <div className="visual-card document-card">
                <div className="visual-icon">
                  <FileText size={38} />
                </div>

                <div className="visual-line" />
                <div className="visual-line medium" />
                <div className="visual-line small" />

                <div className="floating-badge badge-top">
                  <CheckCircle size={18} />
                  Approved
                </div>

                <div className="floating-badge badge-bottom">
                  <ScrollText size={18} />
                  Terms
                </div>
              </div>
            </div>
          </div>

          <Card padding="lg" className="legal-card">
            <div className="legal-meta">
              <h2>Terms of Service</h2>
              <p>Last updated: June 2026</p>
            </div>

            <div className="legal-content legal-grid">
              {[
                [
                  "1. About InOne",
                  "InOne is a student portfolio showcase platform for building and sharing professional portfolios.",
                ],
                [
                  "2. Accounts and Roles",
                  "You may use InOne as a Student, Employer, Career Coach, or Admin.",
                ],
                [
                  "3. Your Content",
                  "You keep ownership of everything you upload, including your profile, resume, projects, and images.",
                ],
                [
                  "4. Acceptable Use",
                  "You agree not to upload unlawful, misleading, or offensive content.",
                ],
                [
                  "5. Sharing and Visibility",
                  "Portfolios are private by default. Shareable links can be controlled or deactivated.",
                ],
                [
                  "6. Career Coach Feedback",
                  "Career coach feedback is guidance and does not guarantee employment outcomes.",
                ],
                [
                  "7. Availability",
                  "InOne is provided as available and may not always be uninterrupted or error-free.",
                ],
                [
                  "8. Changes to Terms",
                  "We may update these Terms. Continued use means you accept the updated version.",
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