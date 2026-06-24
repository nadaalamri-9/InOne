import { Award, Trash2 } from "lucide-react";
import { makeTempId } from "../services/profileApi";
function normalizeCertifications(certifications) {
  if (!Array.isArray(certifications)) return [];

  return certifications.map((cert) => {
    if (typeof cert === "string") {
      return {
        id: null,
        tempId: makeTempId(),
        name: cert,
        year: "",
      };
    }

    return {
      id: cert.id ?? null,
      tempId: cert.tempId ?? makeTempId(),
      name: cert.name ?? "",
      year: cert.year ?? "",
    };
  });
}

function isTextEmpty(value) {
  return !String(value || "").trim();
}

function isValidYear(value) {
  const year = String(value || "").trim();

  if (!year) return true;

  const yearOnly = /^\d{4}$/;
  const yearRange = /^\d{4}\s*-\s*\d{4}$/;
  const yearToPresent = /^\d{4}\s*-\s*present$/i;

  return yearOnly.test(year) || yearRange.test(year) || yearToPresent.test(year);
}

function CertificationSection({
  certifications = [],
  onChange,
  onNotify,
  isEditing,
}) {
  const safeCertifications = normalizeCertifications(certifications);

  const addCertification = () => {
    onChange?.([
      ...safeCertifications,
      {
        id: null,
        tempId: makeTempId(),
        name: "",
        year: "",
      },
    ]);

    onNotify?.("success", "Added.");
  };

  const updateCertification = (index, field, value) => {
    const updatedCertifications = safeCertifications.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );

    onChange?.(updatedCertifications);
  };

  const removeCertification = (index) => {
    const updatedCertifications = safeCertifications.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedCertifications);
    onNotify?.("info", "Removed.");
  };

  return (
    <section className="profile-section-card certification-card">
      <h2 className="profile-section-title">
        <Award className="section-title-icon" aria-hidden="true" />
        Certifications & Bootcamps
      </h2>

      {safeCertifications.length === 0 && (
        <p className="empty-state">No certifications or bootcamps added yet</p>
      )}

      <div className="cert-list">
        {safeCertifications.map((certification, index) => {
          const yearIsInvalid =
            isEditing &&
            !isTextEmpty(certification.year) &&
            !isValidYear(certification.year);

          return (
            <div
              className={`cert-row ${isEditing ? "cert-row-editing" : "cert-row-viewing"
                }`}
              key={certification.id ?? certification.tempId ?? index}
            >
              <div className="cert-field">
                <label>CERTIFICATION / BOOTCAMPS NAME</label>

                <input
                  disabled={!isEditing}
                  value={certification.name}
                  onChange={(e) =>
                    updateCertification(index, "name", e.target.value)
                  }
                />
              </div>

              <div className="cert-field cert-year-field">
                <label>YEAR</label>

                <input
                  disabled={!isEditing}
                  className={yearIsInvalid ? "input-error" : ""}
                  value={certification.year}
                  onChange={(e) =>
                    updateCertification(index, "year", e.target.value)
                  }
                />

                {yearIsInvalid && (
                  <span className="field-error-message">
                    e.g., 2024, 2020-2024, or 2024-present
                  </span>
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  className="cert-delete-btn"
                  onClick={() => removeCertification(index)}
                  title="Delete certification"
                >
                  <Trash2 className="row-delete-icon" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditing && (
        <button
          type="button"
          className="ep-dashed-btn"
          onClick={addCertification}
        >
          + Add certification / bootcamp
        </button>
      )}
    </section>
  );
}

export default CertificationSection;