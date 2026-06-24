import { useCallback, useEffect, useMemo, useState } from "react";

import { loadFeedbackProjects, saveFeedbackProject } from "../services/feedbackApi";
import { buildFeedbackItems, normalizeStatusKey } from "../utils/feedbackHelpers";

export function useFeedback() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const loaded = await loadFeedbackProjects();
        if (isMounted) setProjects(Array.isArray(loaded) ? loaded : []);
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) setError("Could not load feedback.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const feedbackItems = useMemo(() => buildFeedbackItems(projects), [projects]);

  const projectsWithFeedback = useMemo(
    () =>
      projects
        .map((project) => {
          const items = feedbackItems.filter(
            (item) => String(item.projectId) === String(project.id)
          );

          return {
            ...project,
            feedbackItems: items,
            feedbackTotal: items.length,
            feedbackOpen: items.filter((item) => !item.isResolved).length,
            feedbackResolved: items.filter((item) => item.isResolved).length,
          };
        })
        .filter((project) => project.feedbackTotal > 0),
    [projects, feedbackItems]
  );

  const stats = useMemo(
    () => ({
      total: feedbackItems.length,
      reviewed: projectsWithFeedback.length,
      needsRevision: projects.filter((project) => normalizeStatusKey(project.status) === "needs_revision").length,
    }),
    [feedbackItems, projects, projectsWithFeedback]
  );

  const toggleFeedbackResolved = useCallback(
    async (feedbackItem) => {
      if (!feedbackItem) return;

      const targetProject = projects.find(
        (project) => String(project.id) === String(feedbackItem.projectId)
      );

      if (!targetProject) return;

      const currentFeedback = Array.isArray(targetProject.reviewFeedback)
        ? targetProject.reviewFeedback
        : [];

      const nextFeedback = currentFeedback.map((item, index) => {
        const sameFeedback =
          index === feedbackItem.feedbackIndex ||
          (feedbackItem.feedbackSourceId && String(item.id) === String(feedbackItem.feedbackSourceId));

        if (!sameFeedback) return item;

        return {
          ...item,
          isResolved: !feedbackItem.isResolved,
          is_resolved: !feedbackItem.isResolved,
          resolvedAt: !feedbackItem.isResolved ? new Date().toISOString() : "",
        };
      });

      const nextProject = {
        ...targetProject,
        reviewFeedback: nextFeedback,
        updatedAt: new Date().toISOString(),
      };

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          String(project.id) === String(feedbackItem.projectId) ? nextProject : project
        )
      );

      try {
        await saveFeedbackProject(nextProject);
      } catch (saveError) {
        console.error(saveError);
      }
    },
    [projects]
  );

  return {
    loading,
    error,
    projects,
    projectsWithFeedback,
    feedbackItems,
    stats,
    toggleFeedbackResolved,
  };
}
