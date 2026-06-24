import { api, mediaUrl } from "../../../../services/api";

function fullName(student = {}) {
  return `${student.firstName || student.first_name || ""} ${student.lastName || student.last_name || ""}`.trim();
}

function normalizeStudentPortfolio(data = {}) {
  const profile = data.profile || data;
  const id = data.id ?? profile.user_id ?? profile.userId ?? profile.id;
  const firstName = profile.firstName ?? profile.first_name ?? data.firstName ?? data.first_name ?? "";
  const lastName = profile.lastName ?? profile.last_name ?? data.lastName ?? data.last_name ?? "";
  const name = data.name || profile.name || profile.fullName || profile.full_name || fullName({ firstName, lastName });
  const visibility = data.visibility ?? profile.visibility ?? "private";

  return {
    ...profile,
    id,
    user_id: profile.user_id ?? profile.userId ?? id,
    first_name: firstName,
    last_name: lastName,
    fullName: profile.fullName ?? profile.full_name ?? name,
    name,
    photo_url: mediaUrl(profile.photo_url ?? profile.photoUrl ?? data.photo_url ?? data.photoUrl ?? ""),
    photoUrl: mediaUrl(profile.photoUrl ?? profile.photo_url ?? data.photoUrl ?? data.photo_url ?? ""),
    resume_url: mediaUrl(profile.resume_url ?? profile.resumeUrl ?? ""),
    resumeUrl: mediaUrl(profile.resumeUrl ?? profile.resume_url ?? ""),
    visibility,
    projects: Array.isArray(data.projects) ? data.projects : [],
    isPrivate: Boolean(data.is_private ?? data.isPrivate ?? visibility === "private"),
  };
}

export async function getStudentRaw(id) {
  const data = await api.get(`/students/${id}`);
  if (!data) return null;
  return normalizeStudentPortfolio(data);
}
