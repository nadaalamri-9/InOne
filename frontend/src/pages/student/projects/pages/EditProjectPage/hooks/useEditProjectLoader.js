import { useEffect, useState } from "react";

import {
  createEmptyProject,
  getProjectById,
  normalizeProjectFromApi,
} from "../../../services/projectApi";

export function useEditProjectLoader(projectId) {
  const [project, setProject] = useState(createEmptyProject());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);

        if (projectId) {
          const savedProject = await getProjectById(projectId, true);
          setProject(normalizeProjectFromApi(savedProject));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  return { project, setProject, loading };
}
