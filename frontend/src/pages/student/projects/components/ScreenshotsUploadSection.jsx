import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { makeProjectTempId } from "../services/projectApi";
function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ScreenshotsUploadSection({ screenshots = [], onChange, onNotify, isEditing }) {
  const safeScreenshots = Array.isArray(screenshots) ? screenshots : [];

  const handleScreenshotsUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      onNotify?.("error", "Images only");
      event.target.value = "";
      return;
    }

    try {
      const newScreenshots = await Promise.all(
        files.map(async (file) => ({
          id: null,
          tempId: makeProjectTempId(),
          name: file.name,
          url: "",
          preview: await readImageAsDataUrl(file),
          file,
          type: file.type,
          size: file.size,
        }))
      );

      onChange?.([...safeScreenshots, ...newScreenshots]);
      onNotify?.("success", "Added");
    } catch (error) {
      console.error(error);
      onNotify?.("error", "Image failed");
    } finally {
      event.target.value = "";
    }
  };

  const removeScreenshot = (index) => {
    if (!isEditing) return;

    const updatedScreenshots = safeScreenshots.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange?.(updatedScreenshots);
    onNotify?.("info", "Removed");
  };

  return (
    <section className="project-section-card screenshots-card">
      <h2 className="project-section-title">
        <ImagePlus className="project-title-icon" aria-hidden="true" />
        Screenshots
      </h2>

      <div className="screenshots-upload-box">
        <div className="screenshots-upload-info">
          <div className="screenshots-upload-icon-box">
            <UploadCloud className="screenshots-upload-icon" aria-hidden="true" />
          </div>

          <div>
            <strong>Project screenshots</strong>
            <p>
              {isEditing
                ? "Upload project screenshots"
                : "Click Edit to update screenshots"}
            </p>
          </div>
        </div>

        {isEditing && (
          <label className="screenshots-upload-btn">
            Upload images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleScreenshotsUpload}
            />
          </label>
        )}
      </div>

      {safeScreenshots.length > 0 && (
        <div className="screenshots-list">
          {safeScreenshots.map((screenshot, index) => {
            const src = screenshot.preview || screenshot.url;

            return (
              <div
                className="screenshot-item"
                key={screenshot.id ?? screenshot.tempId ?? index}
              >
                {src ? (
                  <img src={src} alt={screenshot.name || "Project screenshot"} />
                ) : (
                  <div className="screenshot-placeholder">
                    <ImagePlus aria-hidden="true" />
                  </div>
                )}

                <div className="screenshot-meta">
                  <span title={screenshot.name}>{screenshot.name}</span>

                  {isEditing && (
                    <button
                      type="button"
                      className="screenshot-remove-btn"
                      onClick={() => removeScreenshot(index)}
                      title="Remove screenshot"
                    >
                      <Trash2 className="screenshot-remove-icon" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ScreenshotsUploadSection;
