import { Ban, Edit3, Save } from "lucide-react";
import PersonalInfoSection from "../components/PersonalInfoSection";
import ContactInfoSection from "../components/ContactInfoSection";
import SocialLinksSection from "../components/SocialLinksSection";
import SkillsSection from "../components/SkillsSection";
import TargetRolesSection from "../components/TargetRolesSection";
import EducationSection from "../components/EducationSection";
import CertificationSection from "../components/CertificationSection";
import Resume from "../components/Resume";
import ToastMessage from "../../../../components/ToastMessage";
import { useProfileEditor } from "../hooks/useProfileEditor";
function EditProfilePage({ profile, setProfile }) {
  const {
    safeProfile,
    isEditing,
    saving,
    toast,
    setToast,

    startEditing,
    cancelEditing,
    saveChanges,
    updateProfileField,
    updateSocialLinks,
    notify,
  } = useProfileEditor(profile, setProfile);

  return (
    <>
      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <div className="edit-profile-container">
        <header className="edit-profile-header">
          <div className="edit-profile-heading">
            <h1>Profile</h1>
            <p>
              {isEditing
                ? "Update your profile details"
                : "How employers see your profile"}
            </p>
          </div>

          <div className="profile-header-actions">
            {!isEditing ? (
              <button
                type="button"
                className="ep-edit-btn"
                onClick={startEditing}
              >
                <Edit3 className="ep-action-icon" aria-hidden="true" />
                Edit profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="ep-cancel-btn"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  <Ban className="ep-action-icon" aria-hidden="true" />
                  Cancel
                </button>

                <button
                  type="button"
                  className="ep-save-btn"
                  onClick={saveChanges}
                  disabled={saving}
                >
                  <Save className="ep-action-icon" aria-hidden="true" />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </>
            )}
          </div>
        </header>

        <div className="profile-grid-layout">
          <div className="profile-left-column">
            <PersonalInfoSection
              profile={safeProfile}
              updateProfile={updateProfileField}
              isEditing={isEditing}
            />

            <ContactInfoSection
              profile={safeProfile}
              updateProfile={updateProfileField}
              isEditing={isEditing}
            />

            <EducationSection
              education={safeProfile.education}
              onChange={(education) =>
                updateProfileField("education", education)
              }
              onNotify={notify}
              isEditing={isEditing}
            />

            <CertificationSection
              certifications={safeProfile.certifications}
              onChange={(newCertifications) =>
                updateProfileField("certifications", newCertifications)
              }
              onNotify={notify}
              isEditing={isEditing}
            />
          </div>

          <div className="profile-right-column">
            <Resume
              resumeFile={safeProfile.resumeFile}
              resumeUrl={safeProfile.resumeUrl}
              resumeName={safeProfile.resumeName}
              onChange={(file) => {
                updateProfileField("resumeFile", file);
                updateProfileField("resumeName", file?.name || "");

                if (!file) {
                  updateProfileField("resumeUrl", "");
                }
              }}
              onNotify={notify}
              isEditing={isEditing}
            />

            <SocialLinksSection
              socialLinks={safeProfile.socialLinks}
              updateSocialLinks={updateSocialLinks}
              isEditing={isEditing}
            />

            <SkillsSection
              skills={safeProfile.skills}
              onChange={(skills) => updateProfileField("skills", skills)}
              onNotify={notify}
              isEditing={isEditing}
            />

            <TargetRolesSection
              targetRoles={safeProfile.targetRoles}
              onChange={(targetRoles) =>
                updateProfileField("targetRoles", targetRoles)
              }
              onNotify={notify}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;