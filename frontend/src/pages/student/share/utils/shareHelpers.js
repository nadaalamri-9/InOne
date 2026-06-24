// Pure helpers for building the shareable portfolio URL.

function getAppOrigin() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "http://localhost:5173";
}

export function slugify(text) {
  return String(text || "student")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeShareToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }

  return (Math.random().toString(36) + Math.random().toString(36))
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);
}

// Public portfolios use a clean URL. Private portfolios add a private access key in the link.
export function buildShareUrl({ visibility, slug, shareToken }) {
  const origin = getAppOrigin();
  const safeSlug = slug || "student";

  if (visibility === "public") {
    return `${origin}/portfolio/share/${safeSlug}`;
  }

  return `${origin}/portfolio/share/${safeSlug}?access=${shareToken || ""}`;
}
