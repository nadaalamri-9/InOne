import { ArrowRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
function ResumeSummaryCard({ profile }) {
  const hasResume = Boolean(profile.resumeUrl || profile.resumeName);

  return (
    <section className="dashboard-resume-card">
      <div className="dashboard-resume-header">
        <h2>Resume</h2>
        <Link to="/profile" className="dashboard-resume-view-link">
          View
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className={`dashboard-resume-file ${hasResume ? "has-resume" : "is-empty"}`}>
        <div className="dashboard-resume-icon">
          <FileText aria-hidden="true" />
        </div>

        <div className="dashboard-resume-info">
          <strong>{hasResume ? profile.resumeName || "Resume uploaded" : "No resume"}</strong>
          {hasResume && <span>Saved in your profile</span>}
        </div>

        {hasResume && (
          <a
            href={profile.resumeUrl}
            download={profile.resumeName || "resume.pdf"}
            className="dashboard-resume-download"
            aria-label="Download resume"
          >
            <Download aria-hidden="true" />
            <span>Download</span>
          </a>
        )}
      </div>
    </section>
  );
}

export default ResumeSummaryCard;
