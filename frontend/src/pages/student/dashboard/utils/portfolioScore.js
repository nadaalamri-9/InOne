function hasText(value, minLength = 1) {
  return String(value || "").trim().length >= minLength;
}

function hasValidEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasPhone(value) {
  const phone = String(value || "").replace(/[\s\-()]/g, "");
  return phone.length >= 8;
}

function hasUrl(value) {
  const text = String(value || "").trim();
  return /^https?:\/\//i.test(text) || /^www\./i.test(text) || text.includes(".");
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function normalizeStatus(status) {
  return String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function itemHasName(item) {
  if (typeof item === "string") return hasText(item, 2);
  return (
    hasText(item?.name, 2) ||
    hasText(item?.degree, 2) ||
    hasText(item?.school, 2) ||
    hasText(item?.title, 2)
  );
}

function countCompleted(checks) {
  return checks.filter(Boolean).length;
}

function calculateSkillsPoints(skills = []) {
  const skillCount = Array.isArray(skills) ? skills.filter(itemHasName).length : 0;

  if (skillCount >= 5) return 5;
  if (skillCount >= 3) return 4;
  if (skillCount >= 1) return 2;
  return 0;
}

function countPersonalInformation(profile = {}) {
  return countCompleted([
    hasText(profile.firstName, 2),
    hasText(profile.lastName, 2),
    hasText(profile.role, 3),
    hasText(profile.title, 3),
    hasText(profile.bio, 10),
    hasText(profile.aboutMe, 10),
    hasPhone(profile.phone),
    hasValidEmail(profile.email),
    hasText(profile.location, 3),
  ]);
}

function countSkills(profile = {}, projects = []) {
  const profileSkills = Array.isArray(profile.skills) ? profile.skills.filter(itemHasName).length : 0;
  const targetRoles = Array.isArray(profile.targetRoles) ? profile.targetRoles.filter(itemHasName).length : 0;
  const projectSkills = projects.reduce((total, project) => {
    const skills = Array.isArray(project.skills) ? project.skills.filter(itemHasName).length : 0;
    const tools = Array.isArray(project.tools) ? project.tools.filter(itemHasName).length : 0;
    return total + skills + tools;
  }, 0);

  return Math.min(10, profileSkills + targetRoles + projectSkills);
}

export function calculateProfilePoints(profile = {}) {
  const socialLinks = profile.socialLinks || {};

  const personalInformationPoints =
    (hasText(profile.firstName, 2) && hasText(profile.lastName, 2) ? 3 : 0) +
    (hasText(profile.role, 3) ? 3 : 0) +
    (hasText(profile.title, 8) ? 2 : 0) +
    (hasPhone(profile.phone) ? 1 : 0) +
    (hasValidEmail(profile.email) ? 1 : 0) +
    (hasText(profile.location, 3) ? 2 : 0);

  const aboutBioPoints =
    (hasText(profile.bio, 20) ? 3 : 0) +
    (hasText(profile.aboutMe, 20) ? 3 : 0);

  const socialLinksPoints =
    (hasUrl(socialLinks.linkedin) ? 2 : 0) +
    (hasUrl(socialLinks.github) ? 2 : 0) +
    (hasUrl(socialLinks.website) ? 1 : 0);

  const skillsPoints = calculateSkillsPoints(profile.skills);

  const educationPoints = hasItems(profile.education?.filter(itemHasName)) ? 3 : 0;
  const certificationPoints = hasItems(profile.certifications?.filter(itemHasName)) ? 2 : 0;
  const targetRolesPoints = hasItems(profile.targetRoles?.filter(itemHasName)) ? 2 : 0;

  return Math.min(
    35,
    personalInformationPoints +
      aboutBioPoints +
      socialLinksPoints +
      skillsPoints +
      educationPoints +
      certificationPoints +
      targetRolesPoints
  );
}

export function calculateProfileProgress(profile = {}) {
  return Math.round((calculateProfilePoints(profile) / 35) * 100);
}

export function calculateSkillsProgress(profile = {}, projects = []) {
  const profileSkills = Array.isArray(profile.skills) ? profile.skills.filter(itemHasName) : [];
  const targetRoles = Array.isArray(profile.targetRoles) ? profile.targetRoles.filter(itemHasName) : [];
  const projectSkillCount = projects.reduce((total, project) => {
    const skills = Array.isArray(project.skills) ? project.skills.filter(itemHasName) : [];
    const tools = Array.isArray(project.tools) ? project.tools.filter(itemHasName) : [];
    return total + skills.length + tools.length;
  }, 0);

  let score = 0;
  if (profileSkills.length >= 1) score += 35;
  if (profileSkills.length >= 3) score += 20;
  if (targetRoles.length >= 1) score += 20;
  if (projectSkillCount >= 3) score += 25;

  return Math.min(score, 100);
}

export function calculateResumeProgress(profile = {}) {
  let score = 0;
  if (hasText(profile.resumeName)) score += 50;
  if (hasText(profile.resumeUrl)) score += 50;
  return Math.min(score, 100);
}

function calculateProjectQualityPoints(project = {}) {
  const basicsCompleted = countCompleted([
    hasText(project.title, 3),
    hasText(project.duration, 3),
    hasText(project.summary, 15),
    hasText(project.overview, 20),
  ]);

  const problemSolutionCompleted = countCompleted([
    hasText(project.businessProblem, 15),
    hasText(project.solution, 15),
    hasText(project.architecture, 15),
  ]);

  const roleResultsCompleted = countCompleted([
    hasText(project.role, 3),
    hasText(project.results, 15),
  ]);

  const basicsPoints = (basicsCompleted / 4) * 2;
  const problemSolutionPoints = (problemSolutionCompleted / 3) * 2;
  const roleResultsPoints = (roleResultsCompleted / 2) * 1;
  const featuresPoints = hasItems(project.features?.filter(itemHasName)) ? 1 : 0;
  const toolsPoints =
    hasItems(project.tools?.filter(itemHasName)) || hasItems(project.skills?.filter(itemHasName))
      ? 1
      : 0;

  const hasProjectLink = hasUrl(project.githubUrl) || hasUrl(project.demoUrl);
  const hasTeamStatus = Boolean(project.isSoloProject) || hasItems(project.teamMembers?.filter(itemHasName));
  const linksTeamPoints = (hasProjectLink ? 0.5 : 0) + (hasTeamStatus ? 0.5 : 0);

  return Math.min(
    8,
    basicsPoints +
      problemSolutionPoints +
      roleResultsPoints +
      featuresPoints +
      toolsPoints +
      linksTeamPoints
  );
}

export function calculateProjectsProgress(projects = []) {
  if (!projects.length) return 0;

  const limitedProjects = projects.slice(0, 5);
  const qualityPoints = limitedProjects.reduce(
    (sum, project) => sum + calculateProjectQualityPoints(project),
    0
  );

  return Math.round((qualityPoints / 40) * 100);
}

export function calculatePortfolioScore(profile = {}, projects = []) {
  const personalInformation = countPersonalInformation(profile);
  const personalInformationMax = 9;

  const skills = countSkills(profile, projects);
  const skillsMax = 10;

  const projectsAdded = Array.isArray(projects) ? projects.length : 0;
  const targetProjects = 6;
  const completedProjects = Math.min(projectsAdded, targetProjects);

  const personalInformationPercent = Math.round((personalInformation / personalInformationMax) * 100);
  const skillsPercent = Math.round((skills / skillsMax) * 100);
  const projectsAddedPercent = Math.round((completedProjects / targetProjects) * 100);

  const overall = Math.round(
    personalInformationPercent * 0.45 +
      skillsPercent * 0.25 +
      projectsAddedPercent * 0.30
  );

  return {
    overall,

    personalInformation,
    personalInformationMax,
    personalInformationPercent,

    // Backward-compatible keys used by older components.
    profile: personalInformation,
    profileMax: personalInformationMax,
    profilePercent: personalInformationPercent,

    skills,
    skillsMax,
    skillsPercent,

    projects: completedProjects,
    projectsMax: targetProjects,
    projectsPercent: projectsAddedPercent,

    projectsAdded,
    targetProjects,
    projectsAddedPercent,

    // Resume stays separate from Portfolio Strength.
    resume: calculateResumeProgress(profile),
  };
}

export function getPortfolioLevel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 40) return "In Progress";
  return "Getting Started";
}

export function getProjectStatusCounts(projects = []) {
  return projects.reduce(
    (counts, project) => {
      const status = normalizeStatus(project.status);
      counts.total += 1;
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    },
    {
      total: 0,
      draft: 0,
      needs_revision: 0,
      ready: 0,
      published: 0,
    }
  );
}

export function formatDashboardDate(value) {
  if (!value) return "Not updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function normalizeDashboardStatus(status) {
  return normalizeStatus(status);
}
