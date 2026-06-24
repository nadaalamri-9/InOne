import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { getCoachProfile, saveCoachProfile } from "./coachApi";
function getInitials(name) {
  return String(name || "Coach")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";
}

function CoachProfilePage() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCoachProfile().then(setForm);
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  function updatePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photoUrl: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const savedProfile = await saveCoachProfile(form);
    setForm(savedProfile);
    setSaved(true);
  }

  if (!form) return <div className="coach-page"><div className="coach-empty">Loading profile...</div></div>;

  return (
    <div className="coach-page">
      <header className="coach-page-header">
        <div className="coach-page-heading">
          <h1>Coach Profile</h1>
          <p>This name and photo will appear on feedback messages sent to students.</p>
        </div>
      </header>

      <form className="coach-card" onSubmit={handleSubmit}>
        <div className="coach-card-header">
          <div>
            <h2>Profile details</h2>
            <p>Keep your coach identity clear for students.</p>
          </div>
          <button type="submit" className="coach-primary-btn"><Save size={16} /> Save profile</button>
        </div>

        <div className="coach-meta-row" style={{ marginBottom: 24, alignItems: "center" }}>
          <div className="coach-profile-photo">
            {form.photoUrl ? <img src={form.photoUrl} alt="Coach" /> : getInitials(form.name)}
          </div>
          <label className="coach-soft-btn" style={{ cursor: "pointer" }}>
            <Upload size={16} /> Upload photo
            <input type="file" accept="image/*" onChange={updatePhoto} hidden />
          </label>
          {saved ? <span className="coach-meta-chip">Saved</span> : null}
        </div>

        <div className="coach-form-grid">
          <label className="coach-form-field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={updateField} />
          </label>
          <label className="coach-form-field">
            <span>Career / role</span>
            <input name="title" value={form.title} onChange={updateField} />
          </label>
          <label className="coach-form-field">
            <span>Email</span>
            <input name="email" value={form.email} onChange={updateField} />
          </label>
          <label className="coach-form-field">
            <span>Location</span>
            <input name="location" value={form.location} onChange={updateField} />
          </label>
          <label className="coach-form-field coach-form-field-full">
            <span>Bio</span>
            <textarea name="bio" value={form.bio} onChange={updateField} />
          </label>
        </div>
      </form>
    </div>
  );
}

export default CoachProfilePage;
