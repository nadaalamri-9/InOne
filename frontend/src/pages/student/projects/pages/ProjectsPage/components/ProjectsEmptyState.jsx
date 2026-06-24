import { PlusCircle } from "lucide-react";
const EMPTY_STATE_MESSAGES = {
  published: {
    title: "No published projects",
    description: "Published projects will show here",
  },
  draft: {
    title: "No drafts yet",
    description: "Saved drafts will show here",
  },
  needs_revision: {
    title: "No revisions needed",
    description: "Projects with feedback will show here",
  },
  ready: {
    title: "No ready projects",
    description: "Approved projects will show here",
  },
};

function ProjectsEmptyState({ projectFilter }) {
  const message = EMPTY_STATE_MESSAGES[projectFilter] || EMPTY_STATE_MESSAGES.draft;

  return (
    <div className="projects-empty-state">
      <PlusCircle className="projects-empty-icon" aria-hidden="true" />
      <h2>{message.title}</h2>
      <p>{message.description}</p>
    </div>
  );
}

export default ProjectsEmptyState;
