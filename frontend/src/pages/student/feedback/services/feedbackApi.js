import { getMyProjects, saveMyProject } from "../../projects/services/projectApi";

export function loadFeedbackProjects() {
  return getMyProjects();
}

export function saveFeedbackProject(project) {
  return saveMyProject(project);
}
