import { GraduationCap, Trash2 } from "lucide-react";
import { makeTempId } from "../services/profileApi";
function normalizeEducation(education) {
  if (!Array.isArray(education)) return [];

  return education.map((item) => ({
    id: item.id ?? null,
    tempId: item.tempId ?? makeTempId(),
    degree: item.degree ?? "",
    school: item.school ?? item.university ?? "",
    year: item.year ?? "",
  }));
}

function isTextEmpty(value) {
  return !String(value || "").trim();
}

function isValidEducationYear(value) {
  const year = String(value || "").trim();

  if (!year) return false;

  const yearOnly = /^\d{4}$/;
  const yearRange = /^\d{4}\s*-\s*\d{4}$/;
  const yearToPresent = /^\d{4}\s*-\s*present$/i;

  return yearOnly.test(year) || yearRange.test(year) || yearToPresent.test(year);
}

function isEducationRowMissingRequired(item) {
  return (
    isTextEmpty(item.degree) ||
    isTextEmpty(item.school) ||
    isTextEmpty(item.year)
  );
}

function hasAnyEducationValue(item) {
  return (
    !isTextEmpty(item.degree) ||
    !isTextEmpty(item.school) ||
    !isTextEmpty(item.year)
  );
}

function EducationSection({ education = [], onChange, onNotify, isEditing }) {
  const safeEducation = normalizeEducation(education);

  const addEducation = () => {
    const hasIncompleteRow = safeEducation.some((item) => {
      return hasAnyEducationValue(item) && isEducationRowMissingRequired(item);
    });

    const hasEmptyRow = safeEducation.some((item) => {
      return !hasAnyEducationValue(item);
    });

    if (hasIncompleteRow) {
      onNotify?.("error", "Incomplete row.");
      return;
    }

    if (hasEmptyRow) {
      onNotify?.("error", "Empty row.");
      return;
    }

    onChange?.([
      ...safeEducation,
      {
        id: null,
        tempId: makeTempId(),
        degree: "",
        school: "",
        year: "",
      },
    ]);

    onNotify?.("success", "Added.");
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = safeEducation.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );

    onChange?.(updatedEducation);
  };

  const removeEducation = (index) => {
    const updatedEducation = safeEducation.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedEducation);
    onNotify?.("info", "Removed.");
  };

  return (
    <section className="profile-section-card education-card">
      <h2 className="profile-section-title">
        <GraduationCap className="section-title-icon" aria-hidden="true" />
        Education
      </h2>

      {safeEducation.length === 0 && (
        <p className="empty-state">No education added yet</p>
      )}

      <div className="education-list">
        {safeEducation.map((item, index) => {
          const rowHasAnyValue = hasAnyEducationValue(item);

          const degreeIsMissing =
            isEditing && rowHasAnyValue && isTextEmpty(item.degree);

          const schoolIsMissing =
            isEditing && rowHasAnyValue && isTextEmpty(item.school);

          const yearIsMissing =
            isEditing && rowHasAnyValue && isTextEmpty(item.year);

          const yearIsInvalid =
            isEditing &&
            !isTextEmpty(item.year) &&
            !isValidEducationYear(item.year);

          return (
            <div
              className={`education-row ${isEditing ? "education-row-editing" : "education-row-viewing"
                }`}
              key={item.id ?? item.tempId ?? index}
            >
              <div className="education-field">
                <label>
                  <span className="label-dot"></span>
                  DEGREE <span className="required-mark">*</span>
                </label>

                <input
                  required
                  disabled={!isEditing}
                  className={degreeIsMissing ? "input-error" : ""}
                  value={item.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />

                {degreeIsMissing && (
                  <span className="field-error-message">
                    Required.
                  </span>
                )}
              </div>

              <div className="education-field">
                <label>
                  <span className="label-dot"></span>
                  UNIVERSITY / SCHOOL <span className="required-mark">*</span>
                </label>

                <input
                  required
                  disabled={!isEditing}
                  className={schoolIsMissing ? "input-error" : ""}
                  value={item.school}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />

                {schoolIsMissing && (
                  <span className="field-error-message">
                    Required.
                  </span>
                )}
              </div>

              <div className="education-field">
                <label>
                  <span className="label-dot"></span>
                  YEAR <span className="required-mark">*</span>
                </label>

                <input
                  required
                  disabled={!isEditing}
                  className={
                    yearIsMissing || yearIsInvalid ? "input-error" : ""
                  }
                  value={item.year}
                  onChange={(e) =>
                    updateEducation(index, "year", e.target.value)
                  }
                />

                {yearIsMissing && (
                  <span className="field-error-message">
                    Required.
                  </span>
                )}

                {yearIsInvalid && (
                  <span className="field-error-message">
                    Enter year.
                  </span>
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  className="delete-row-btn"
                  onClick={() => removeEducation(index)}
                  title="Delete education"
                >
                  <Trash2 className="row-delete-icon" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isEditing && (
        <button type="button" className="ep-dashed-btn" onClick={addEducation}>
          + Add education
        </button>
      )}
    </section>
  );
}

export default EducationSection;