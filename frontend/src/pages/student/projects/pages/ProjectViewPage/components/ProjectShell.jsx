import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, X } from "lucide-react";

import navLogo from "../../../../../../assets/logo.svg";
import footerLogo from "../../../../../../assets/logo.svg";
import { checkProjectContent } from "../../../../../../services/aiApi";

function scoreText(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "—";
  return `${Math.max(0, Math.min(100, Math.round(number)))}%`;
}

function likelihoodLabel(value) {
  const text = String(value || "low").trim().toLowerCase();
  if (text === "high") return "High AI likelihood";
  if (text === "medium") return "Medium AI likelihood";
  return "Low AI likelihood";
}

function ProjectShell({ children, backLabel = "Back", project }) {
  const navigate = useNavigate();

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const navItems = useMemo(
    () => [
      { label: "Overview", href: "#overview" },
      { label: "Screenshots", href: "#screenshots" },
      { label: "Team", href: "#team" },
      { label: "Tools", href: "#tools" },
      { label: "Features", href: "#features" },
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

  async function handleAiCheck() {
    setIsAiOpen(true);
    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      if (!project?.id) {
        throw new Error("Save the project first, then run the AI check.");
      }

      const result = await checkProjectContent(project.id, project);
      setAiResult(result);
    } catch (error) {
      setAiError(
        error?.message ||
          "Something went wrong while checking this project."
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="project-shell-page">
      <header className="project-public-nav">
        <div className="container project-navbar-container">
          <Link className="project-public-brand" to="/" aria-label="Go to Home">
            <img src={navLogo} alt="InOne" />
          </Link>

          <nav className="project-public-links" aria-label="Project sections">
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

          <div className="project-nav-actions">
            <button
              type="button"
              className="project-back-btn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              {backLabel}
            </button>

            <button
              type="button"
              className="project-ai-check-btn"
              onClick={handleAiCheck}
            >
              <Sparkles size={18} />
              AI Check
            </button>
          </div>
        </div>
      </header>

      <main className="project-shell-content">{children}</main>

      <footer className="project-public-footer">
        <div className="container project-footer-container">
          <Link className="project-footer-brand" to="/" aria-label="Go to Home">
            <img src={footerLogo} alt="InOne" />
          </Link>

          <p className="project-footer-copy">© 2026 InOne. All rights reserved.</p>
        </div>
      </footer>

      {isAiOpen && (
        <div className="project-ai-overlay">
          <div className="project-ai-popup">
            <button
              type="button"
              className="project-ai-close"
              onClick={() => setIsAiOpen(false)}
              aria-label="Close AI check"
            >
              <X size={18} />
            </button>

            <div className="project-ai-head">
              <span>
                <Sparkles size={20} />
              </span>

              <div>
                <p>Project AI Check</p>
                <h2>Content Review</h2>
              </div>
            </div>

            <div className="project-ai-body">
              {aiLoading && (
                <p className="project-ai-muted">Checking project content...</p>
              )}

              {aiError && <p className="project-ai-error">{aiError}</p>}

              {!aiLoading && !aiError && aiResult && (
                <div className="project-ai-result">
                  <strong>{likelihoodLabel(aiResult.ai_likelihood)}</strong>

                  <div className="project-ai-score-grid">
                    <span>Overall: {scoreText(aiResult.overall_score)}</span>
                    <span>Clarity: {scoreText(aiResult.clarity_score)}</span>
                    <span>Completeness: {scoreText(aiResult.completeness_score)}</span>
                  </div>

                  <p>{aiResult.feedback}</p>

                  {Array.isArray(aiResult.improvement_suggestions) &&
                    aiResult.improvement_suggestions.length > 0 && (
                      <ul className="project-ai-suggestions">
                        {aiResult.improvement_suggestions.slice(0, 4).map((suggestion) => (
                          <li key={suggestion}>{suggestion}</li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectShell;
