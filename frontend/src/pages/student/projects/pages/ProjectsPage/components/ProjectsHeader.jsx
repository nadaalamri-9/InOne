import { ListFilter, Trash2 } from "lucide-react";
import { PROJECT_FILTER_OPTIONS } from "../constants/projectFilters";
function ProjectsHeader({
  hasProjects,
  deleteMode,
  filterMenuOpen,
  activeFilterLabel,
  projectFilter,
  onToggleFilterMenu,
  onChangeFilter,
  onToggleDeleteMode,
}) {
  return (
    <header className="projects-page-header">
      <div>
        <h1>My Projects</h1>
        <p>Build, manage, and showcase your work to employers</p>
      </div>

      <div className="projects-page-actions">
        {!deleteMode && hasProjects && (
          <div className="projects-filter-wrap">
            <button
              type="button"
              className={`projects-filter-btn ${filterMenuOpen ? "is-open" : ""}`}
              onClick={onToggleFilterMenu}
              aria-expanded={filterMenuOpen}
              aria-haspopup="menu"
            >
              <ListFilter className="projects-filter-icon" aria-hidden="true" />
              <span>{activeFilterLabel}</span>
            </button>

            {filterMenuOpen && (
              <div className="projects-filter-menu" role="menu">
                {PROJECT_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={option.value === projectFilter ? "is-selected" : ""}
                    onClick={() => onChangeFilter(option.value)}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {hasProjects && (
          <button
            type="button"
            className={`projects-delete-mode-btn ${deleteMode ? "is-active" : ""}`}
            onClick={onToggleDeleteMode}
            aria-label={deleteMode ? "Close delete mode" : "Delete project"}
            title={deleteMode ? "Close delete mode" : "Delete project"}
          >
            <Trash2 className="projects-header-trash-icon" aria-hidden="true" />
            <span>{deleteMode ? "Close" : "Delete project"}</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default ProjectsHeader;
