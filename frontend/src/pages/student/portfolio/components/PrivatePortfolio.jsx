import { Lock } from "lucide-react";
import ProfilePic from "../../../../assets/ProfilePic.svg";
function getInitials(name = "") {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PrivatePortfolio({ name, photoUrl, avatarInitials }) {
  const displayName = name ? `${name}'s portfolio is private` : "This portfolio is private";
  const initials = avatarInitials || getInitials(name);
  const avatarSrc = photoUrl || ProfilePic;

  return (
    <main className="private-page">
      <section className="private-card">
        <div className="private-avatar-wrap">
          {avatarSrc ? (
            <img src={avatarSrc} alt={name || "Profile"} className="private-avatar" />
          ) : (
            <span className="private-avatar private-avatar-fallback">{initials || "P"}</span>
          )}

          <span className="private-lock" aria-hidden="true">
            <Lock className="portfolio-icon" size={22} strokeWidth={2.2} />
          </span>
        </div>

        <p className="private-eyebrow">Private profile</p>
        <h1>{displayName}</h1>
      </section>
    </main>
  );
}

export default PrivatePortfolio;
