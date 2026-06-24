import { api } from "../../../../services/api";

function normalizeApiSettings(data = {}) {
  return {
    visibility: data.visibility === "public" ? "public" : "private",
    slug: data.slug ?? data.portfolio_slug ?? "",
    shareToken: data.shareToken ?? data.share_token ?? "",
  };
}

export async function loadShareSettings() {
  const data = await api.get("/me/portfolio/share");
  return normalizeApiSettings(data);
}

export async function saveVisibility(visibility) {
  const safe = visibility === "public" ? "public" : "private";
  const data = await api.patch("/me/portfolio/visibility", { visibility: safe });
  return normalizeApiSettings(data);
}

export async function regenerateShareToken() {
  const data = await api.post("/me/portfolio/share/regenerate", {});
  return { shareToken: data.share_token ?? data.shareToken ?? "" };
}
