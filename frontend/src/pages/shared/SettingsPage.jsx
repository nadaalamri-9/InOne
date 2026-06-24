import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, MapPin, Phone, Save, Upload, UserRound } from "lucide-react";
import { api, getStoredUser, mediaUrl } from "../../services/api";

const ROLE_CONFIG = {
  student: {
    title: "Settings",
    subtitle: "Update your account information and password.",
    defaultRole: "Student",
  },
  coach: {
    title: "Settings",
    subtitle: "Update your coach account information and password.",
    defaultRole: "Career Coach",
  },
  employer: {
    title: "Settings",
    subtitle: "Update employer account information and password.",
    defaultRole: "Hiring Team",
  },
  admin: {
    title: "Settings",
    subtitle: "Update admin account information and password.",
    defaultRole: "Platform Manager",
  },
};

function normalizeRole(value) {
  const role = String(value || "student").toLowerCase().trim();
  if (role.includes("coach")) return "coach";
  if (role.includes("employer") || role.includes("hiring")) return "employer";
  if (role.includes("admin") || role.includes("manager")) return "admin";
  return "student";
}

function buildInitialForm(currentUser) {
  const firstName = currentUser?.first_name || currentUser?.firstName || "";
  const lastName = currentUser?.last_name || currentUser?.lastName || "";
  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: currentUser?.email || "",
    city: currentUser?.city || currentUser?.location || "",
    phone: currentUser?.phone || "",
    photoUrl: currentUser?.photoUrl || currentUser?.photo_url || "",
    password: "",
  };
}

function SettingsPage({ role = "student", setProfile }) {
  const config = ROLE_CONFIG[normalizeRole(role)] || ROLE_CONFIG.student;
  const currentUser = getStoredUser();
  const [form, setForm] = useState(() => buildInitialForm(currentUser));
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/me").then((data) => {
      setForm((current) => ({ ...buildInitialForm(data), photoUrl: current.photoUrl }));
    }).catch(() => {});
    // Load the saved profile photo (stored on the profile, not the user record).
    api.get("/profile/me").then((p) => {
      setForm((current) => ({
        ...current,
        city: p?.location ?? current.city,
        phone: p?.phone ?? current.phone,
        photoUrl: p?.photo_url ? mediaUrl(p.photo_url) : current.photoUrl,
      }));
    }).catch(() => {});
  }, []);

  const initials = useMemo(() => {
    return (
      form.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "A"
    );
  }, [form.name]);

  function updateField(field, value) {
    setSaved(false);
    setError("");
    if (field === "name") {
      const parts = value.trim().split(/\s+/);
      setForm((current) => ({
        ...current,
        name: value,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
      }));
    } else {
      setForm((current) => ({ ...current, [field]: value }));
    }
  }

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show an instant local preview while the upload is in flight.
    const reader = new FileReader();
    reader.onload = () => updateField("photoUrl", String(reader.result || ""));
    reader.readAsDataURL(file);

    // Persist the photo to the backend so it shows everywhere and survives reload.
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await api.upload("/profile/photo", formData);
      const absoluteUrl = mediaUrl(result.photo_url);

      setForm((current) => ({ ...current, photoUrl: absoluteUrl }));

      const stored = getStoredUser();
      if (stored) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ ...stored, photoUrl: absoluteUrl, photo_url: result.photo_url })
        );
        window.dispatchEvent(new Event("inone-account-updated"));
      }

      if (typeof setProfile === "function") {
        setProfile((current) => ({ ...current, photoUrl: absoluteUrl }));
      }
    } catch {
      setError("Photo upload failed. Please try again.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const updates = {};
      if (form.firstName) updates.first_name = form.firstName;
      if (form.lastName !== undefined) updates.last_name = form.lastName;
      if (form.email) updates.email = form.email;

      const updatedUser = await api.patch("/auth/me", updates);

      const updatedProfile = await api.put("/profile/me", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        location: form.city,
        phone: form.phone,
      });

      if (form.password && form.password.trim().length >= 6) {
        await api.post("/auth/change-password", { new_password: form.password.trim() });
      }

      const stored = getStoredUser();
      if (stored) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...stored,
            ...updatedUser,
            location: updatedProfile?.location || form.city,
            city: updatedProfile?.location || form.city,
            phone: updatedProfile?.phone || form.phone,
            photoUrl: updatedProfile?.photo_url ? mediaUrl(updatedProfile.photo_url) : stored.photoUrl,
            photo_url: updatedProfile?.photo_url || stored.photo_url,
          })
        );
        window.dispatchEvent(new Event("inone-account-updated"));
      }

      if (typeof setProfile === "function") {
        setProfile((current) => ({
          ...current,
          ...updatedUser,
          location: updatedProfile?.location || form.city,
          city: updatedProfile?.location || form.city,
          phone: updatedProfile?.phone || form.phone,
          photoUrl: updatedProfile?.photo_url ? mediaUrl(updatedProfile.photo_url) : current?.photoUrl,
        }));
      }

      setSaved(true);
      setForm((f) => ({ ...f, password: "" }));
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      setError(err?.message || "Failed to save changes. Please try again.");
    }
  }

  return (
    <div className="settings-page">
      <header className="settings-page-header">
        <div className="settings-page-heading">
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>

        {saved ? (
          <div className="settings-save-toast">
            <CheckCircle2 aria-hidden="true" />
            Saved
          </div>
        ) : null}
      </header>

      <div className="settings-layout">
        <aside className="settings-profile-card">
          <div className="settings-avatar-wrap">
            <div className="settings-avatar">
              {form.photoUrl ? <img src={form.photoUrl} alt="Profile preview" /> : initials}
            </div>
            <span className="settings-avatar-camera" aria-hidden="true">
              <Camera />
            </span>
          </div>

          <label className="settings-photo-upload">
            <Upload aria-hidden="true" />
            Upload profile pic
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </label>

          <h2>{form.name || "Account name"}</h2>
          <p>{form.email || "email@example.com"}</p>
          <span>{config.defaultRole}</span>
        </aside>

        <form className="settings-form-card" onSubmit={handleSubmit}>
          <div className="settings-form-header">
            <div>
              <h2>Account information</h2>
            </div>
          </div>

          {error ? <p className="settings-error" style={{ color: "red", marginBottom: "1rem" }}>{error}</p> : null}

          <div className="settings-form-grid">
            <label className="settings-field settings-field-full">
              <span>Full name</span>
              <div className="settings-input-wrap">
                <UserRound aria-hidden="true" />
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter full name"
                />
              </div>
            </label>

            <label className="settings-field">
              <span>Email</span>
              <div className="settings-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </label>

            <label className="settings-field">
              <span>City</span>
              <div className="settings-input-wrap">
                <MapPin aria-hidden="true" />
                <input
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Riyadh, Saudi Arabia"
                />
              </div>
            </label>

            <label className="settings-field">
              <span>Phone number</span>
              <div className="settings-input-wrap">
                <Phone aria-hidden="true" />
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+966 5X XXX XXXX"
                />
              </div>
            </label>

            <label className="settings-field">
              <span>New password</span>
              <div className="settings-input-wrap">
                <LockKeyhole aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  className="settings-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
            </label>
          </div>

          <div className="settings-actions">
            <button type="submit" className="settings-save-button">
              <Save aria-hidden="true" />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
