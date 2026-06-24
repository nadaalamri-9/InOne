import ToastMessage from "../../../../components/ToastMessage";
import ProjectAddCard from "./ProjectsPage/components/ProjectAddCard";
import ProjectCard from "./ProjectsPage/components/ProjectCard";
import ProjectDeleteModal from "./ProjectsPage/components/ProjectDeleteModal";
import ProjectsEmptyState from "./ProjectsPage/components/ProjectsEmptyState";
import ProjectsHeader from "./ProjectsPage/components/ProjectsHeader";
import { useProjectsPage } from "./ProjectsPage/hooks/useProjectsPage";
function ProjectsPage() {
  const {
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
  } = useProjectsPage();

  const handleChangeFilter = (nextFilter) => {
    setProjectFilter(nextFilter);
    setFilterMenuOpen(false);
  };

  return (
    <section className="projects-page-container">
      <ProjectsHeader
        hasProjects={hasProjects}
        deleteMode={deleteMode}
        filterMenuOpen={filterMenuOpen}
        activeFilterLabel={activeFilterLabel}
        projectFilter={projectFilter}
        onToggleFilterMenu={() => setFilterMenuOpen((current) => !current)}
        onChangeFilter={handleChangeFilter}
        onToggleDeleteMode={handleToggleDeleteMode}
      />

      <div className="projects-grid">
        {loading ? (
          <div className="projects-loading-card">Loading projects...</div>
        ) : (
          <>
            {showAddProjectCard && <ProjectAddCard />}

            {hasVisibleProjects ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id ?? project.tempId}
                  project={project}
                  isDeleteMode={deleteMode}
                  onRequestDelete={setProjectToDelete}
                />
              ))
            ) : (
              !showAddProjectCard && <ProjectsEmptyState projectFilter={projectFilter} />
            )}
          </>
        )}
      </div>

      <ToastMessage toast={toast} onClose={() => setToast(null)} />

      <ProjectDeleteModal
        project={projectToDelete}
        isDeleting={isDeleting}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}

export default ProjectsPage;
