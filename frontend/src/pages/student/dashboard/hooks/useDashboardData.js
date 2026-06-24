import { useEffect, useMemo, useState } from "react";
import { getMyProfile } from "../../profile/services/profileApi";
import { getMyProjects } from "../../projects/services/projectApi";
import {
  calculatePortfolioScore,
  getPortfolioLevel,
  getProjectStatusCounts,
} from "../utils/portfolioScore";

function getUniqueCollaboratorsCount(projects) {
  const collaborators = new Set();

  projects.forEach((project) => {
    if (!Array.isArray(project.teamMembers)) return;

    project.teamMembers.forEach((member) => {
      const key = String(
        member.email ||
          member.userId ||
          member.id ||
          member.name ||
          ""
      )
        .trim()
        .toLowerCase();

      if (key) {
        collaborators.add(key);
      }
    });
  });

  return collaborators.size;
}


export function useDashboardData(appProfile) {
  const [profile, setProfile] = useState(appProfile || null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [loadedProfile, loadedProjects] = await Promise.all([
          getMyProfile(),
          getMyProjects(),
        ]);

        if (!isMounted) return;

        const hasLiveProfileData = Boolean(
          appProfile?.id ||
            appProfile?.firstName ||
            appProfile?.lastName ||
            appProfile?.title ||
            appProfile?.resumeUrl ||
            appProfile?.resumeName
        );

        setProfile(
          hasLiveProfileData ? { ...loadedProfile, ...appProfile } : loadedProfile
        );
        setProjects(loadedProjects);
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) {
          setError("Could not load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [appProfile]);

  const score = useMemo(
    () => calculatePortfolioScore(profile || {}, projects),
    [profile, projects]
  );

  const level = useMemo(() => getPortfolioLevel(score.overall), [score.overall]);

  const statusCounts = useMemo(() => getProjectStatusCounts(projects), [projects]);

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
        )
        .slice(0, 8),
    [projects]
  );

  const allFeedback = useMemo(() => {
    return projects
      .flatMap((project) =>
        (Array.isArray(project.reviewFeedback) ? project.reviewFeedback : []).map(
          (feedback) => ({
            projectTitle: project.title || "Untitled project",
            message: feedback.message || feedback.feedback || feedback,
            createdAt: feedback.createdAt || feedback.created_at || project.updatedAt,
          })
        )
      )
      .filter((feedback) => String(feedback.message || "").trim());
  }, [projects]);

  const recentFeedback = useMemo(() => allFeedback.slice(0, 3), [allFeedback]);

  const feedbackCount = allFeedback.length;

  const portfolioViews = Number(profile?.portfolioViews || profile?.views || 0);

  const collaboratorsCount = useMemo(
    () => getUniqueCollaboratorsCount(projects),
    [projects]
  );

  return {
    profile: profile || {},
    projects,
    recentProjects,
    recentFeedback,
    score,
    level,
    statusCounts,
    feedbackCount,
    portfolioViews,
    collaboratorsCount,
    loading,
    error,
  };
}
