import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
function ProjectAddCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="project-add-card"
      onClick={() => navigate("/project/new")}
    >
      <PlusCircle className="project-add-card-icon" aria-hidden="true" />
      <span>Add new project</span>
    </button>
  );
}

export default ProjectAddCard;
