import { useEffect, useState } from "react";
import {
  createEmptyProfile,
  normalizeProfileFromApi,
  saveMyProfile,
  getMyProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadResume,
  deleteResume,
} from "../services/profileApi";

function makeSafeProfile(profile) {
  return {
    ...createEmptyProfile(),
    ...profile,
    socialLinks: { ...createEmptyProfile().socialLinks, ...(profile?.socialLinks || {}) },
    targetRoles: Array.isArray(profile?.targetRoles) ? profile.targetRoles : [],
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    education: Array.isArray(profile?.education) ? profile.education : [],
    certifications: Array.isArray(profile?.certifications) ? profile.certifications : [],
  };
}

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

function isValidEmail(value) {
  const email = String(value || "").trim();
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(value) {
  const phone = String(value || "").trim();
  if (!phone) return true;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+9665\d{8}|05\d{8}|\+\d{8,15})$/.test(cleaned);
}

function isValidYear(value) {
  const year = String(value || "").trim();
  if (!year) return false;
  return /^\d{4}$/.test(year) || /^\d{4}\s*-\s*\d{4}$/.test(year) || /^\d{4}\s*-\s*present$/i.test(year);
}

function isEducationEmpty(item) {
  return isTextEmpty(item.degree) && isTextEmpty(item.school) && isTextEmpty(item.year);
}

function isEducationIncomplete(item) {
  const hasDegree = !isTextEmpty(item.degree);
  const hasSchool = !isTextEmpty(item.school);
  const hasYear = !isTextEmpty(item.year);
  return (hasDegree || hasSchool || hasYear) && !(hasDegree && hasSchool && hasYear);
}

function isCertEmpty(item) {
  return isTextEmpty(item.name) && isTextEmpty(item.year);
}

function cleanProfile(profile) {
  return {
    ...profile,
    firstName: String(profile.firstName || "").trim(),
    lastName: String(profile.lastName || "").trim(),
    role: String(profile.role || "").trim(),
    title: String(profile.title || "").trim(),
    bio: String(profile.bio || "").trim(),
    aboutMe: String(profile.aboutMe || "").trim(),
    location: String(profile.location || "").trim(),
    email: String(profile.email || "").trim(),
    phone: String(profile.phone || "").trim(),
    resumeName: String(profile.resumeName || "").trim(),
    portfolioSlug: String(profile.portfolioSlug || "").trim(),
    visibility: profile.visibility || "private",
    reviewStatus: profile.reviewStatus || "draft",
    socialLinks: {
      linkedin: String(profile.socialLinks?.linkedin || "").trim(),
      github: String(profile.socialLinks?.github || "").trim(),
      website: String(profile.socialLinks?.website || "").trim(),
    },
    targetRoles: profile.targetRoles.filter((r) => !isTextEmpty(r.name)),
    skills: profile.skills.filter((s) => !isTextEmpty(s.name)),
    education: profile.education.filter((e) => !isEducationEmpty(e)),
    certifications: profile.certifications
      .map((c) => ({ ...c, name: String(c.name || "").trim(), year: String(c.year || "").trim() }))
      .filter((c) => !isCertEmpty(c)),
  };
}

function validateProfile(profile) {
  if (profile.education.some(isEducationIncomplete)) return "Missing required education fields.";
  if (profile.education.some((e) => !isValidYear(e.year))) return "Invalid education year. Try: 2024, 2020-2024, or 2024-present.";
  if (profile.certifications.some((c) => !isTextEmpty(c.year) && !isValidYear(c.year))) return "Invalid certification year.";
  if (!isValidUrl(profile.socialLinks.linkedin)) return "Invalid LinkedIn URL.";
  if (!isValidUrl(profile.socialLinks.github)) return "Invalid GitHub URL.";
  if (!isValidUrl(profile.socialLinks.website)) return "Invalid website URL.";
  if (!isValidEmail(profile.email)) return "Invalid email. Example: name@email.com";
  if (!isValidPhone(profile.phone)) return "Invalid phone. Example: 05XXXXXXXX";
  return null;
}

export function useProfileEditor(profile, setProfile) {
  const [draftProfile, setDraftProfile] = useState(createEmptyProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [profileBeforeEdit, setProfileBeforeEdit] = useState(null);
  const [loadedFromApi, setLoadedFromApi] = useState(false);

  // Load profile from API on mount if we don't have real data yet
  useEffect(() => {
    if (loadedFromApi) return;
    if (profile?.id) {
      setLoadedFromApi(true);
      return;
    }
    getMyProfile()
      .then((data) => {
        setLoadedFromApi(true);
        setProfile(data);
      })
      .catch(() => setLoadedFromApi(true));
    // Intentionally run once on mount; guarded internally by loadedFromApi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setDraftProfile(makeSafeProfile(profile));
    }
  }, [profile, isEditing]);

  const safeProfile = makeSafeProfile(draftProfile);

  const notify = (type, text) => setToast({ id: Date.now(), type, text });

  const startEditing = () => {
    const snapshot = makeSafeProfile(profile);
    setProfileBeforeEdit(snapshot);
    setDraftProfile(snapshot);
    setIsEditing(true);
    notify("info", "Editing...");
  };

  const cancelEditing = () => {
    const snapshot = makeSafeProfile(profileBeforeEdit || profile);
    setDraftProfile(snapshot);
    setProfile(snapshot);
    setProfileBeforeEdit(null);
    setIsEditing(false);
    notify("info", "Cancelled.");
  };

  const updateProfileField = (field, value) => {
    if (!isEditing) return;
    setDraftProfile((prev) => ({ ...createEmptyProfile(), ...prev, [field]: value }));
    const liveSidebarFields = ["photoFile", "photoPreview", "photoUrl"];
    if (liveSidebarFields.includes(field)) {
      setProfile((prev) => ({ ...createEmptyProfile(), ...prev, [field]: value }));
    }
  };

  const updateSocialLinks = (field, value) => {
    if (!isEditing) return;
    setDraftProfile((prev) => ({
      ...createEmptyProfile(),
      ...prev,
      socialLinks: { ...createEmptyProfile().socialLinks, ...(prev?.socialLinks || {}), [field]: value },
    }));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);

      const cleaned = cleanProfile(safeProfile);
      const validationError = validateProfile(cleaned);
      if (validationError) {
        notify("error", validationError);
        return;
      }

      let photoUrl = cleaned.photoUrl;
      let resumeUrl = cleaned.resumeUrl;
      let resumeName = cleaned.resumeName;

      // Upload photo if a new file was selected
      if (cleaned.photoFile) {
        try {
          const result = await uploadProfilePhoto(cleaned.photoFile);
          photoUrl = result.photo_url;
        } catch {
          notify("error", "Photo upload failed.");
          return;
        }
      }

      // Delete photo if explicitly cleared
      if (!cleaned.photoFile && !cleaned.photoUrl && !cleaned.photoPreview && profileBeforeEdit?.photoUrl) {
        try {
          await deleteProfilePhoto();
        } catch { /* ignore */ }
        photoUrl = "";
      }

      // Upload resume if a new file was selected
      if (cleaned.resumeFile) {
        try {
          const result = await uploadResume(cleaned.resumeFile);
          resumeUrl = result.resume_url;
          resumeName = result.resume_name;
        } catch {
          notify("error", "Resume upload failed.");
          return;
        }
      }

      // Delete resume if cleared
      if (!cleaned.resumeFile && !cleaned.resumeUrl && !cleaned.resumeName && profileBeforeEdit?.resumeUrl) {
        try {
          await deleteResume();
        } catch { /* ignore */ }
        resumeUrl = "";
        resumeName = "";
      }

      const profileToSave = {
        ...cleaned,
        photoUrl,
        resumeUrl,
        resumeName,
        photoFile: null,
        resumeFile: null,
      };

      const savedProfile = await saveMyProfile(profileToSave);
      const normalized = normalizeProfileFromApi(savedProfile);

      setProfile(normalized);
      setDraftProfile(normalized);

      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (currentUser) {
          const nextUser = {
            ...currentUser,
            first_name: normalized.firstName || currentUser.first_name,
            last_name: normalized.lastName || currentUser.last_name,
            name: `${normalized.firstName || ""} ${normalized.lastName || ""}`.trim() || currentUser.name,
            fullName: `${normalized.firstName || ""} ${normalized.lastName || ""}`.trim() || currentUser.fullName,
            photo_url: normalized.photoUrl || currentUser.photo_url || "",
            photoUrl: normalized.photoUrl || currentUser.photoUrl || "",
            avatar: normalized.photoUrl || currentUser.avatar || "",
          };

          localStorage.setItem("currentUser", JSON.stringify(nextUser));
        }
      } catch {
        // Keep profile save successful even if localStorage is unavailable.
      }

      window.dispatchEvent(new Event("account-settings-updated"));
      window.dispatchEvent(new Event("inone-account-updated"));

      setProfileBeforeEdit(null);
      setIsEditing(false);
      notify("success", "Saved.");
    } catch (error) {
      console.error(error);
      notify("error", "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return {
    safeProfile,
    isEditing,
    saving,
    toast,
    setToast,
    notify,
    startEditing,
    cancelEditing,
    saveChanges,
    updateProfileField,
    updateSocialLinks,
  };
}
