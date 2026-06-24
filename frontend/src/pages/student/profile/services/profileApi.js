import { api, mediaUrl, toRelativeMedia } from "../../../../services/api";

export function makeTempId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function createEmptyProfile() {
  return {
    id: null,
    userId: null,
    firstName: "",
    lastName: "",
    role: "",
    title: "",
    bio: "",
    aboutMe: "",
    location: "",
    email: "",
    phone: "",
    photoUrl: "",
    photoFile: null,
    photoPreview: "",
    targetRoles: [],
    socialLinks: { linkedin: "", github: "", website: "" },
    skills: [],
    education: [],
    certifications: [],
    resumeUrl: "",
    resumeName: "",
    resumeFile: null,
    portfolioSlug: "",
    visibility: "private",
    reviewStatus: "draft",
  };
}

function normalizeList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") return { id: null, tempId: makeTempId(), name: item };
    return { id: item.id ?? null, tempId: item.tempId ?? makeTempId(), name: item.name ?? "" };
  });
}

export function normalizeProfileFromApi(data = {}) {
  const emptyProfile = createEmptyProfile();
  const socialLinks = data.socialLinks ?? data.social_links ?? {};

  return {
    ...emptyProfile,
    id: data.id ?? null,
    userId: data.userId ?? data.user_id ?? null,
    firstName: data.firstName ?? data.first_name ?? "",
    lastName: data.lastName ?? data.last_name ?? "",
    role: data.role ?? "",
    title: data.title ?? data.headline ?? "",
    bio: data.bio ?? "",
    aboutMe: data.aboutMe ?? data.about_me ?? "",
    location: data.location ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    photoUrl: mediaUrl(data.photoUrl ?? data.photo_url ?? ""),
    photoFile: null,
    photoPreview: data.photoPreview ?? "",
    targetRoles: normalizeList(data.targetRoles ?? data.target_roles ?? []),
    socialLinks: {
      linkedin: socialLinks.linkedin ?? "",
      github: socialLinks.github ?? "",
      website: socialLinks.website ?? socialLinks.portfolio ?? data.website ?? "",
    },
    skills: normalizeList(data.skills ?? []),
    education: Array.isArray(data.education)
      ? data.education.map((item) => ({
          id: item.id ?? null,
          tempId: item.tempId ?? makeTempId(),
          degree: item.degree ?? "",
          school: item.school ?? item.university ?? "",
          year: item.year ?? "",
        }))
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((cert) => {
          if (typeof cert === "string") return { id: null, tempId: makeTempId(), name: cert, year: "" };
          return { id: cert.id ?? null, tempId: cert.tempId ?? makeTempId(), name: cert.name ?? "", year: cert.year ?? "" };
        })
      : [],
    resumeUrl: mediaUrl(data.resumeUrl ?? data.resume_url ?? ""),
    resumeName: data.resumeName ?? data.resume_name ?? data.resumeFile?.name ?? data.resume_file_name ?? "",
    resumeFile: null,
    portfolioSlug: data.portfolioSlug ?? data.portfolio_slug ?? "",
    visibility: data.visibility ?? "private",
    reviewStatus: data.reviewStatus ?? data.review_status ?? "draft",
  };
}

export function profileToApiPayload(profile) {
  return {
    first_name: profile.firstName,
    last_name: profile.lastName,
    role: profile.role,
    headline: profile.title,
    bio: profile.bio,
    about_me: profile.aboutMe,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    target_roles: profile.targetRoles,
    social_links: profile.socialLinks,
    skills: profile.skills,
    education: profile.education,
    certifications: profile.certifications,
    resume_url: toRelativeMedia(profile.resumeUrl),
    resume_name: profile.resumeName,
    portfolio_slug: profile.portfolioSlug,
    visibility: profile.visibility,
    review_status: profile.reviewStatus,
  };
}

export async function getMyProfile() {
  const data = await api.get("/profile/me");
  return normalizeProfileFromApi(data);
}

export async function saveMyProfile(profile) {
  const data = await api.put("/profile/me", profileToApiPayload(profile));
  return normalizeProfileFromApi(data);
}

export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.upload("/profile/photo", formData);
}

export async function deleteProfilePhoto() {
  return api.delete("/profile/photo");
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  return api.upload("/profile/resume", formData);
}

export async function deleteResume() {
  return api.delete("/profile/resume");
}
