import { getProjectStatusClass, getProjectStatusLabel } from "../utils/projectViewHelpers";
function ProjectStatusPill({ status, className = "" }) {
  return (
    <span className={`projects-status-pill ${getProjectStatusClass(status)} ${className}`.trim()}>
      {getProjectStatusLabel(status)}
    </span>
  );
}

export default ProjectStatusPill;
