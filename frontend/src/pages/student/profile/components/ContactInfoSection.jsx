import { Mail, MapPin, Phone } from "lucide-react";
function isTextEmpty(value) {
  return !String(value || "").trim();
}

function isValidEmail(value) {
  const email = String(value || "").trim();

  if (!email) return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(value) {
  const phone = String(value || "").trim();

  if (!phone) return true;

  const cleanedPhone = phone.replace(/[\s\-()]/g, "");

  return /^(\+9665\d{8}|05\d{8}|\+\d{8,15})$/.test(cleanedPhone);
}

function cleanPhoneInput(value) {
  return value.replace(/[^\d+\s\-()]/g, "");
}

function ContactInfoSection({ profile, updateProfile, isEditing }) {
  const emailIsInvalid =
    isEditing && !isTextEmpty(profile.email) && !isValidEmail(profile.email);

  const phoneIsInvalid =
    isEditing && !isTextEmpty(profile.phone) && !isValidPhone(profile.phone);

  return (
    <section className="profile-section-card contact-info-card">
      <h2 className="profile-section-title">
        <Phone className="section-title-icon" aria-hidden="true" />
        Contact information
      </h2>

      <div className="contact-grid">
        <div className="form-group">
          <label className="label-with-icon">
            <Phone className="field-label-icon" aria-hidden="true" />
            PHONE
          </label>

          <input
            disabled={!isEditing}
            type="tel"
            inputMode="tel"
            className={phoneIsInvalid ? "input-error" : ""}
            value={profile.phone}
            onChange={(e) =>
              updateProfile("phone", cleanPhoneInput(e.target.value))
            }
            placeholder="05XXXXXXXX"
          />

          {phoneIsInvalid && (
            <span className="field-error-message">e.g., 05XXXXXXXX</span>
          )}
        </div>

        <div className="form-group">
          <label className="label-with-icon">
            <Mail className="field-label-icon" aria-hidden="true" />
            EMAIL
          </label>

          <input
            disabled={!isEditing}
            type="email"
            className={emailIsInvalid ? "input-error" : ""}
            value={profile.email}
            onChange={(e) => updateProfile("email", e.target.value)}
            placeholder="you@example.com"
          />

          {emailIsInvalid && (
            <span className="field-error-message">e.g., you@example.com</span>
          )}
        </div>

        <div className="form-group location-wide">
          <label className="label-with-icon">
            <MapPin className="field-label-icon" aria-hidden="true" />
            LOCATION
          </label>

          <input
            disabled={!isEditing}
            value={profile.location}
            onChange={(e) => updateProfile("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactInfoSection;
