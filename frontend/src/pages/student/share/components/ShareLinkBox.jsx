import { Check, Copy, Link2, RefreshCcw } from "lucide-react";
function ShareLinkBox({ url, visibility, copied, saving, onCopy, onRegenerate }) {
  const isPrivate = visibility === "private";

  return (
    <div className={`share-link ${isPrivate ? "is-private" : "is-public"}`}>
      <div className="share-link-field">
        <Link2 className="share-link-icon" aria-hidden="true" />
        <input
          className="share-link-input"
          type="text"
          readOnly
          value={url}
          aria-label="Your shareable link"
          onFocus={(event) => event.target.select()}
        />

        <div className="share-link-actions">
          <p className={`share-link-note ${isPrivate ? "" : "is-placeholder"}`}>
            {isPrivate
              ? "Resetting the link makes the old one stop working."
              : "Keep this space even so the link box stays the same size."}
          </p>

          <div className="share-link-buttons">
            <button type="button" className="share-link-copy" onClick={onCopy}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>

            {isPrivate ? (
              <button
                type="button"
                className="share-link-reset"
                onClick={onRegenerate}
                disabled={saving}
              >
                <RefreshCcw aria-hidden="true" />
                Reset
              </button>
            ) : (
              <span className="share-link-reset-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareLinkBox;
