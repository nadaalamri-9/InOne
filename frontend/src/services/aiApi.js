import { api } from "./api";

/**
 * Generate a professional summary for the currently displayed portfolio.
 * Passing the visible profile/projects keeps the popup accurate for public
 * portfolio pages, not only the logged-in user's own profile.
 * Returns: { summary: string }
 */
export async function generatePortfolioSummary(portfolio = null) {
  const payload = portfolio
    ? {
        profile: portfolio,
        projects: portfolio.projects || [],
      }
    : {};

  return api.post("/ai/portfolio-summary", payload);
}

/**
 * Run an AI quality / writing check on a specific project.
 * Returns: { overall_score, ai_likelihood, clarity_score, completeness_score, feedback, improvement_suggestions }
 */
export async function checkProjectContent(projectId, project = null) {
  const payload = project ? { project } : {};
  return api.post(`/ai/project-check/${projectId}`, payload);
}
