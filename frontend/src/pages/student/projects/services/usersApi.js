import { api, mediaUrl } from "../../../../services/api";

export function normalizeUserSearchResult(data = {}) {
  return {
    userId: data.userId ?? data.user_id ?? data.id ?? null,
    name:
      data.name ??
      data.fullName ??
      data.full_name ??
      `${data.firstName ?? data.first_name ?? ""} ${
        data.lastName ?? data.last_name ?? ""
      }`.trim() ??
      "",
    email: data.email ?? "",
    photoUrl: mediaUrl(data.photoUrl ?? data.photo_url ?? ""),
    role: data.role ?? "Student",
  };
}

export async function searchUserByEmail(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail) {
    return null;
  }

  try {
    const data = await api.get(`/users/search-by-email?email=${encodeURIComponent(cleanEmail)}`);
    return normalizeUserSearchResult(data);
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}
