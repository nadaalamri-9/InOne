import { Globe, Lock } from "lucide-react";

import { useShareSettings } from "../hooks/useShareSettings";
import ShareVisibilityToggle from "../components/ShareVisibilityToggle";
import ShareLinkBox from "../components/ShareLinkBox";
// Page = composition only. State lives in useShareSettings; UI in components.
function SharePage() {
  const {
    loading,
    saving,
    visibility,
    shareUrl,
    copied,
    changeVisibility,
    regenerate,
    copy,
  } = useShareSettings();

  const isPublic = visibility === "public";

  if (loading) {
    return (
      <div className="share-page">
        <div className="share-state-card">Loading share settings...</div>
      </div>
    );
  }

  return (
    <div className="share-page">
      <header className="share-header">
        <div>
          <h1>Shareable link</h1>
          <p className="share-subtitle">Choose if your portfolio is private or public, then share the link.</p>
        </div>

        <span className={`share-status-pill ${isPublic ? "is-public" : "is-private"}`}>
          {isPublic ? <Globe aria-hidden="true" /> : <Lock aria-hidden="true" />}
          {isPublic ? "Public portfolio" : "Private portfolio"}
        </span>
      </header>

      <section className="share-card">
        <div className="share-card-block">
          <h2>Portfolio privacy</h2>
          <ShareVisibilityToggle
            visibility={visibility}
            onChange={changeVisibility}
            disabled={saving}
          />
        </div>

        <div className="share-divider" />

        <div className="share-card-block">
          <h2>Shareable link</h2>
          <ShareLinkBox
            url={shareUrl}
            visibility={visibility}
            copied={copied}
            saving={saving}
            onCopy={copy}
            onRegenerate={regenerate}
          />
        </div>
      </section>
    </div>
  );
}

export default SharePage;
