import { useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { buildShareUrl } from "../../share/utils/shareHelpers";

function getDashboardShareData(profile = {}) {
  const visibility = profile.visibility === "public" ? "public" : "private";
  const slug = profile.portfolioSlug || profile.portfolio_slug || "";
  const shareToken = profile.shareToken || profile.share_token || "";

  return {
    visibility,
    shareUrl: buildShareUrl({ visibility, slug, shareToken }),
  };
}

function ShareableLinkCard({ profile }) {
  const [copied, setCopied] = useState(false);
  const { shareUrl, visibility } = useMemo(() => getDashboardShareData(profile), [profile]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="dashboard-share-card">
      <div className="dashboard-card-title-row">
        <div>
          <h2>Shareable Link</h2>
          <p>{visibility === "public" ? "Public portfolio" : "Private portfolio"}</p>
        </div>
        <Link to="/share" className="dashboard-share-view-link">
          View
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="dashboard-share-link-box">
        <Link2 aria-hidden="true" />
        <span>{shareUrl}</span>
        <button type="button" onClick={copyLink}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}

export default ShareableLinkCard;
