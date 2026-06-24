import {
  UserRound,
  Briefcase,
  Sparkles,
  FileText,
  Info,
} from "lucide-react";
function PersonalInfoSection({ profile, updateProfile, isEditing }) {
  return (
    <section className="profile-section-card personal-info-card">
      <h2 className="profile-section-title">
        <UserRound className="section-title-icon" aria-hidden="true" />
        Personal information
      </h2>

      <div className="personal-grid">
        <div className="form-group">
          <label className="label-with-icon">
            <UserRound className="field-label-icon" aria-hidden="true" />
            FIRST NAME
          </label>
          <input
            disabled={!isEditing}
            value={profile.firstName}
            onChange={(e) => updateProfile("firstName", e.target.value)}
            placeholder="First name"
          />
        </div>

        <div className="form-group">
          <label className="label-with-icon">
            <UserRound className="field-label-icon" aria-hidden="true" />
            LAST NAME
          </label>
          <input
            disabled={!isEditing}
            value={profile.lastName}
            onChange={(e) => updateProfile("lastName", e.target.value)}
            placeholder="Last name"
          />
        </div>

        <div className="form-group">
          <label className="label-with-icon">
            <Briefcase className="field-label-icon" aria-hidden="true" />
            ROLE / TITLE
          </label>
          <input
            disabled={!isEditing}
            value={profile.role}
            onChange={(e) => updateProfile("role", e.target.value)}
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="form-group">
          <label className="label-with-icon">
            <Sparkles className="field-label-icon" aria-hidden="true" />
            HEADLINE
          </label>
          <input
            disabled={!isEditing}
            value={profile.title}
            onChange={(e) => updateProfile("title", e.target.value)}
            placeholder="e.g., Building scalable web apps"
          />
        </div>

        <div className="form-group full-width">
          <label className="label-with-icon">
            <FileText className="field-label-icon" aria-hidden="true" />
            BIO
          </label>
          <textarea
            disabled={!isEditing}
            value={profile.bio}
            onChange={(e) => updateProfile("bio", e.target.value)}
            placeholder="Write a short bio..."
          />
        </div>

        <div className="form-group full-width about-me-field">
          <label className="label-with-icon">
            <Info className="field-label-icon" aria-hidden="true" />
            ABOUT ME
          </label>

          <textarea
            disabled={!isEditing}
            value={profile.aboutMe || ""}
            onChange={(e) => updateProfile("aboutMe", e.target.value)}
            placeholder="About yourself..."
          />
        </div>
      </div>
    </section>
  );
}

export default PersonalInfoSection;
