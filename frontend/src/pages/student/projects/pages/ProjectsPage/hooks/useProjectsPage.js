import { useEffect, useMemo, useState } from "react";
import { deleteMyProject, getMyProjects } from "../../../services/projectApi";
import { PROJECT_FILTER_OPTIONS } from "../constants/projectFilters";
import { getNormalizedProjectStatus, getProjectTimestamp } from "../utils/projectViewHelpers";

export function useProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const savedProjects = await getMyProjects();
        setProjects(savedProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const nextProjects = [...projects];

    if (["draft", "needs_revision", "ready", "published"].includes(projectFilter)) {
      return nextProjects.filter(
        (project) => getNormalizedProjectStatus(project.status) === projectFilter
      );
    }

    if (projectFilter === "oldest") {
      return nextProjects.sort((a, b) => getProjectTimestamp(a) - getProjectTimestamp(b));
    }

    return nextProjects.sort((a, b) => getProjectTimestamp(b) - getProjectTimestamp(a));
  }, [projectFilter, projects]);

  const activeFilterLabel =
    PROJECT_FILTER_OPTIONS.find((option) => option.value === projectFilter)?.label ||
    "Latest updated";

  const hasProjects = projects.length > 0;
  const showAddProjectCard = projectFilter === "all";
  const hasVisibleProjects = filteredProjects.length > 0;

  const handleToggleDeleteMode = () => {
    setDeleteMode((current) => !current);
    setProjectToDelete(null);
    setFilterMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete?.id) return;

    try {
      setIsDeleting(true);
      await deleteMyProject(projectToDelete.id);
      setProjects((currentProjects) => {
        const nextProjects = currentProjects.filter(
          (project) => String(project.id) !== String(projectToDelete.id)
        );

        if (nextProjects.length === 0) {
          setDeleteMode(false);
          setProjectFilter("all");
        }

        return nextProjects;
      });
      setToast({
        type: "error",
        text: `Project "${projectToDelete.title || "Untitled project"}" deleted.`,
      });
      setProjectToDelete(null);
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        text: "Could not delete the project. Try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    filteredProjects,
    loading,
    deleteMode,
    projectToDelete,
    isDeleting,
    projectFilter,
    filterMenuOpen,
    toast,
    activeFilterLabel,
    hasProjects,
    showAddProjectCard,
    hasVisibleProjects,
    setProjectFilter,
    setFilterMenuOpen,
    setProjectToDelete,
    setToast,
    handleToggleDeleteMode,
    handleConfirmDelete,
  };
}
