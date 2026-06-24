import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, X } from "lucide-react";

import navLogo from "../../../../assets/logo.svg";
import footerLogo from "../../../../assets/logo.svg";
import { generatePortfolioSummary } from "../../../../services/aiApi";
function PortfolioShell({ children, profile }) {
  const navigate = useNavigate();

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");


  const navItems = useMemo(
    () => [
      { label: "About", href: "#about" },
      { label: "Roles", href: "#target-roles" },
      { label: "Education", href: "#education" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  function handleNavClick(event, href) {
    event.preventDefault();

    const section = document.querySelector(href);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  async function handleAiSummarization() {
    setIsAiOpen(true);
    setAiLoading(true);
    setAiError("");
    setAiSummary("");

    try {
      const data = await generatePortfolioSummary(profile);

      setAiSummary(
        data.summary ||
          data.message ||
          "No summary returned from the backend."
      );
    } catch (error) {
      setAiError(
        error?.message ||
          "Something went wrong while generating the AI summary."
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="portfolio-page-shell">
      <header className="portfolio-public-nav">
        <div className="container portfolio-navbar-container">
          <Link
            className="portfolio-public-brand"
            to="/"
            aria-label="Go to Home"
          >
            <img src={navLogo} alt="InOne" />
          </Link>

          <nav className="portfolio-public-links" aria-label="Portfolio sections">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="portfolio-nav-actions">
            <button
              type="button"
              className="portfolio-back-btn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              className="portfolio-ai-btn"
              onClick={handleAiSummarization}
            >
              <Sparkles size={18} />
              AI Summarization
            </button>
          </div>
        </div>
      </header>

      <main className="portfolio-shell">{children}</main>

      <footer className="portfolio-public-footer">
        <div className="container portfolio-footer-container">
          <Link
            className="portfolio-footer-brand"
            to="/"
            aria-label="Go to Home"
          >
            <img src={footerLogo} alt="InOne" />
          </Link>

          <p className="portfolio-footer-copy">
            © 2026 InOne. All rights reserved.
          </p>
        </div>
      </footer>

      {isAiOpen && (
        <div className="portfolio-ai-overlay">
          <div className="portfolio-ai-popup">
            <button
              type="button"
              className="portfolio-ai-close"
              onClick={() => setIsAiOpen(false)}
              aria-label="Close AI summary"
            >
              <X size={18} />
            </button>

            <div className="portfolio-ai-head">
              <span>
                <Sparkles size={20} />
              </span>

              <div>
                <p>AI Portfolio</p>
                <h2>AI Summarization</h2>
              </div>
            </div>

            <div className="portfolio-ai-body">
              {aiLoading && (
                <p className="portfolio-ai-muted">Generating summary...</p>
              )}

              {aiError && <p className="portfolio-ai-error">{aiError}</p>}

              {!aiLoading && !aiError && aiSummary && (
                <p className="portfolio-ai-summary">{aiSummary}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioShell;