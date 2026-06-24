import { Download, FileText, RefreshCw, Trash2 } from "lucide-react";
function Resume({
  resumeFile = null,
  resumeUrl = "",
  resumeName = "",
  onChange,
  onNotify,
  isEditing = true,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      onNotify?.("error", "PDF only");
      event.target.value = "";
      return;
    }

    onChange?.(file);
    onNotify?.("success", "Selected.");
  };

  const removeResume = () => {
    onChange?.(null);
    onNotify?.("info", "Removed.");
  };

  const hasResume = Boolean(resumeFile || resumeName || resumeUrl);
  const canDownloadResume = Boolean(resumeUrl) && !isEditing;

  const resumeTitle = hasResume
    ? resumeFile?.name || resumeName || "Resume uploaded"
    : "No resume";

  const resumeDescription = hasResume
    ? resumeFile
      ? "Selected. Save changes"
      : "Uploaded"
    : isEditing
      ? "Upload PDF"
      : "Edit to upload";

  return (
    <section className="profile-section-card resume-card">
      <h2 className="profile-section-title resume-title">
        <FileText className="section-title-icon" aria-hidden="true" />
        Resume
      </h2>

      <div className="resume-upload-box">
        <div className="resume-upload-info">
          <div className="resume-file-icon">
            <FileText className="resume-file-svg" aria-hidden="true" />
          </div>

          <div className="resume-text">
            <strong title={resumeTitle}>{resumeTitle}</strong>
            <p>{resumeDescription}</p>
          </div>
        </div>

        {(isEditing || canDownloadResume) && (
          <div className="resume-actions">
            {canDownloadResume && (
              <a
                className="resume-download-btn"
                href={resumeUrl}
                download={resumeName || "resume.pdf"}
                title="Download resume"
                onClick={(event) => event.stopPropagation()}
              >
                <Download className="resume-download-icon" aria-hidden="true" />
                Download
              </a>
            )}

            {isEditing && (
              <label
                className={`resume-upload-btn ${hasResume ? "resume-replace-btn" : ""}`}
                title={hasResume ? "Replace resume" : "Choose resume"}
                aria-label={hasResume ? "Replace resume" : "Choose resume"}
              >
                {hasResume ? (
                  <RefreshCw className="resume-replace-icon" aria-hidden="true" />
                ) : (
                  "Choose"
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            )}

            {isEditing && hasResume && (
              <button
                type="button"
                className="resume-trash-btn"
                onClick={removeResume}
                title="Remove resume"
              >
                <Trash2 className="resume-trash-icon" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Resume;