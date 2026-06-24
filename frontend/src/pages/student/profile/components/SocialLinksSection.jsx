import { Share2 } from "lucide-react";

import GitHub from "../../../../assets/GitHub.svg";
import Linkedin from "../../../../assets/Linkedin.svg";
import WebSite from "../../../../assets/WebSite.svg";
function isTextEmpty(value) {
  return !String(value || "").trim();
}

function isValidUrl(value) {
  const text = String(value || "").trim();

  if (!text) return true;

  const urlText = /^https?:\/\//i.test(text) ? text : `https://${text}`;

  try {
    const url = new URL(urlText);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function SocialLinksSection({ socialLinks = {}, updateSocialLinks, isEditing }) {
  const links = {
    linkedin: "",
    github: "",
    website: "",
    ...socialLinks,
  };

  const linkedinIsInvalid =
    isEditing && !isTextEmpty(links.linkedin) && !isValidUrl(links.linkedin);

  const githubIsInvalid =
    isEditing && !isTextEmpty(links.github) && !isValidUrl(links.github);

  const websiteIsInvalid =
    isEditing && !isTextEmpty(links.website) && !isValidUrl(links.website);

  return (
    <section className="profile-section-card social-links-card">
      <h2 className="profile-section-title">
        <Share2 className="social-title-icon" />
        Social links
      </h2>

      <div className="social-grid">
        <div className="social-field">
          <div className="social-input-wrapper">
            <img src={Linkedin} alt="" className="social-input-icon" />

            <input
              disabled={!isEditing}
              className={`social-input ${
                linkedinIsInvalid ? "input-error" : ""
              }`}
              placeholder="LinkedIn URL"
              value={links.linkedin}
              onChange={(e) => updateSocialLinks?.("linkedin", e.target.value)}
            />
          </div>

          {linkedinIsInvalid && (
            <span className="field-error-message">
              e.g., https://linkedin.com/in/username
            </span>
          )}
        </div>

        <div className="social-field">
          <div className="social-input-wrapper">
            <img src={GitHub} alt="" className="social-input-icon" />

            <input
              disabled={!isEditing}
              className={`social-input ${githubIsInvalid ? "input-error" : ""}`}
              placeholder="GitHub URL"
              value={links.github}
              onChange={(e) => updateSocialLinks?.("github", e.target.value)}
            />
          </div>

          {githubIsInvalid && (
            <span className="field-error-message">
              e.g., https://github.com/username
            </span>
          )}
        </div>

        <div className="social-field">
          <div className="social-input-wrapper">
            <img src={WebSite} alt="" className="social-input-icon" />

            <input
              disabled={!isEditing}
              className={`social-input ${
                websiteIsInvalid ? "input-error" : ""
              }`}
              placeholder="Personal Website URL"
              value={links.website}
              onChange={(e) => updateSocialLinks?.("website", e.target.value)}
            />
          </div>

          {websiteIsInvalid && (
            <span className="field-error-message">
              e.g., https://mywebsite.com
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export default SocialLinksSection;
