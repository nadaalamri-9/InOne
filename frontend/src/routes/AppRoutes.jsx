import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardPage from "../pages/student/dashboard/pages/DashboardPage";
import EditProfilePage from "../pages/student/profile/pages/EditProfilePage";
import ProjectsPage from "../pages/student/projects/pages/ProjectsPage";
import ProjectEditorPage from "../pages/student/projects/pages/EditProjectPage/ProjectEditorPage";
import ProjectViewPage from "../pages/student/projects/pages/ProjectViewPage";
import CreateProjectPage from "../pages/student/projects/pages/CreateProjectPage";
import PortfolioPage from "../pages/student/portfolio/pages/PortfolioPage";
import FeedbackPage from "../pages/student/feedback/pages/FeedbackPage";
import SharePage from "../pages/student/share/pages/SharePage";
import StudentPortfolioPage from "../pages/student/students/pages/StudentPortfolioPage";
import StudentProjectViewPage from "../pages/student/students/pages/StudentProjectViewPage";
import CoachDashboardPage from "../pages/coach/CoachDashboardPage";
import CoachProjectsPage from "../pages/coach/CoachProjectsPage";
import CoachStudentsPage from "../pages/coach/CoachStudentsPage";
import CoachProjectReviewPage from "../pages/coach/CoachProjectReviewPage";
import CoachFeedbackPage from "../pages/coach/CoachFeedbackPage";
import CoachProfilePage from "../pages/coach/CoachProfilePage";
import { coachSidebarItems } from "../pages/coach/coachSidebarItems";
import { getDefaultCoachProfile } from "../pages/coach/coachApi";
import EmployerDashboardPage from "../pages/employer/EmployerDashboardPage";
import EmployerCandidatesPage from "../pages/employer/EmployerCandidatesPage";
import EmployerSavedPage from "../pages/employer/EmployerSavedPage";
import { employerSidebarItems } from "../pages/employer/employerSidebarItems";
import { getDefaultEmployerProfile } from "../pages/employer/employerApi";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminEditUserPage from "../pages/admin/AdminEditUserPage";
import { adminSidebarItems } from "../pages/admin/adminSidebarItems";
import { getDefaultAdminProfile } from "../pages/admin/adminApi";
import SettingsPage from "../pages/shared/SettingsPage";
import HomePage from "../pages/home/HomePage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import TermsOfService from "../pages/legal/TermsOfService";
import Contact from "../pages/legal/Contact";
import Portfolios from "../pages/shared/Portfolios";
import { useAuth } from "../context/AuthContext";
import { api, getStoredUser, mediaUrl } from "../services/api";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/privacy", "/terms", "/contact", "/portfolios"];

function RequireAuth({ children, allowedRoles }) {
  const { user } = useAuth();
  const storedUser = user || getStoredUser();

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
    const routes = { student: "/dashboard", coach: "/coach", employer: "/employer", admin: "/admin" };
    return <Navigate to={routes[storedUser.role] || "/login"} replace />;
  }

  return children;
}

function SharedPortfolioRoute() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasPrivateToken = params.has("access") || params.has("token");
  return <PortfolioPage viewer={{ role: "employer", hasPrivateToken }} />;
}

function AppRoutes({ profile, setProfile }) {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/portfolios" element={<Portfolios />} />

      {/* Student app */}
      <Route path="/dashboard" element={<RequireAuth allowedRoles={["student"]}><DashboardPage profile={profile} /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth allowedRoles={["student"]}><EditProfilePage profile={profile} setProfile={setProfile} /></RequireAuth>} />
      <Route path="/project" element={<RequireAuth allowedRoles={["student"]}><ProjectsPage /></RequireAuth>} />
      <Route path="/project/new" element={<RequireAuth allowedRoles={["student"]}><CreateProjectPage /></RequireAuth>} />
      <Route path="/project/:projectId/view" element={<RequireAuth allowedRoles={["student"]}><ProjectViewPage /></RequireAuth>} />
      <Route path="/project/:projectId/edit" element={<RequireAuth allowedRoles={["student"]}><ProjectEditorPage /></RequireAuth>} />
      <Route path="/portfolio" element={<RequireAuth allowedRoles={["student"]}><PortfolioPage viewer={{ role: "owner", hasPrivateToken: true }} /></RequireAuth>} />
      <Route path="/portfolio/project/:projectId" element={<ProjectViewPage publicView />} />
      <Route path="/portfolio/share/:portfolioSlug" element={<SharedPortfolioRoute />} />
      <Route path="/portfolio/student/:studentId" element={<StudentPortfolioPage />} />
      <Route path="/portfolio/student/:studentId/project/:projectId" element={<StudentProjectViewPage />} />
      <Route path="/feedback" element={<RequireAuth allowedRoles={["student"]}><FeedbackPage /></RequireAuth>} />
      <Route path="/feedback/:projectId" element={<RequireAuth allowedRoles={["student"]}><FeedbackPage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><SettingsPage role="student" setProfile={setProfile} /></RequireAuth>} />

      {/* Coach app */}
      <Route path="/coach" element={<Navigate to="/coach/dashboard" replace />} />
      <Route path="/coach/dashboard" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachDashboardPage /></RequireAuth>} />
      <Route path="/coach/students" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachStudentsPage /></RequireAuth>} />
      <Route path="/coach/projects" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachProjectsPage /></RequireAuth>} />
      <Route path="/coach/projects/:projectId" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachProjectReviewPage /></RequireAuth>} />
      <Route path="/coach/feedback" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachFeedbackPage /></RequireAuth>} />
      <Route path="/coach/profile" element={<RequireAuth allowedRoles={["coach", "admin"]}><CoachProfilePage /></RequireAuth>} />
      <Route path="/coach/settings" element={<RequireAuth allowedRoles={["coach", "admin"]}><SettingsPage role="coach" /></RequireAuth>} />

      {/* Employer app */}
      <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
      <Route path="/employer/dashboard" element={<RequireAuth allowedRoles={["employer", "admin"]}><EmployerDashboardPage /></RequireAuth>} />
      <Route path="/employer/candidates" element={<RequireAuth allowedRoles={["employer", "admin"]}><EmployerCandidatesPage /></RequireAuth>} />
      <Route path="/employer/saved" element={<RequireAuth allowedRoles={["employer", "admin"]}><EmployerSavedPage /></RequireAuth>} />
      <Route path="/employer/settings" element={<RequireAuth allowedRoles={["employer", "admin"]}><SettingsPage role="employer" /></RequireAuth>} />

      {/* Admin app */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={["admin"]}><AdminDashboardPage /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth allowedRoles={["admin"]}><AdminUsersPage /></RequireAuth>} />
      <Route path="/admin/users/:userId/edit" element={<RequireAuth allowedRoles={["admin"]}><AdminEditUserPage /></RequireAuth>} />
      <Route path="/admin/settings" element={<RequireAuth allowedRoles={["admin"]}><SettingsPage role="admin" /></RequireAuth>} />

      <Route path="/share" element={<SharePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppLayout({ profile, setProfile }) {
  const location = useLocation();
  const { user } = useAuth();
  const storedUser = user || getStoredUser();
  const [accountVersion, setAccountVersion] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");

  // The profile photo lives on the backend profile (set in Settings), not on the
  // auth/user record — so load it from the API and refresh it whenever the
  // account changes. Works for every role (a profile is created on demand).
  useEffect(() => {
    if (!storedUser) {
      setProfilePhoto("");
      return;
    }
    let cancelled = false;
    const loadPhoto = () => {
      api
        .get("/profile/me")
        .then((p) => {
          if (!cancelled) setProfilePhoto(p?.photo_url ? mediaUrl(p.photo_url) : "");
        })
        .catch(() => {});
    };
    loadPhoto();
    window.addEventListener("inone-account-updated", loadPhoto);
    window.addEventListener("account-settings-updated", loadPhoto);
    return () => {
      cancelled = true;
      window.removeEventListener("inone-account-updated", loadPhoto);
      window.removeEventListener("account-settings-updated", loadPhoto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedUser?.id]);

  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      if (location.hash) {
        const section = document.getElementById(location.hash.slice(1));
        if (section) { section.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 60);
    return () => window.clearTimeout(scrollTimer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const refresh = () => setAccountVersion((v) => v + 1);
    window.addEventListener("account-settings-updated", refresh);
    window.addEventListener("inone-account-updated", refresh);
    return () => {
      window.removeEventListener("account-settings-updated", refresh);
      window.removeEventListener("inone-account-updated", refresh);
    };
  }, []);

  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);
  const isPortfolioPage = location.pathname.startsWith("/portfolio");

  if (isPublicPage || isPortfolioPage) {
    return <AppRoutes profile={profile} setProfile={setProfile} />;
  }

  accountVersion; // trigger re-render on account updates

  const isCoachPage = location.pathname.startsWith("/coach");
  const isEmployerPage = location.pathname.startsWith("/employer");
  const isAdminPage = location.pathname.startsWith("/admin");

  const buildAccount = (u) => u ? {
    firstName: u.first_name || u.firstName || "",
    lastName: u.last_name || u.lastName || "",
    role: u.role,
    email: u.email,
    photoUrl: u.photo_url || u.photoUrl || "",
  } : null;

  // Overlay the backend profile photo (if any) onto the account the sidebar uses.
  const withPhoto = (acc) => (acc ? { ...acc, photoUrl: profilePhoto || acc.photoUrl } : acc);

  const sidebarConfig = isAdminPage
    ? { account: withPhoto(buildAccount(storedUser)) || getDefaultAdminProfile(), items: adminSidebarItems }
    : isEmployerPage
      ? { account: withPhoto(buildAccount(storedUser)) || getDefaultEmployerProfile(), items: employerSidebarItems }
      : isCoachPage
        ? { account: withPhoto(buildAccount(storedUser)) || getDefaultCoachProfile(), items: coachSidebarItems }
        : { account: withPhoto(buildAccount(storedUser)), items: undefined };

  return (
    <div className="app-shell">
      <Sidebar profile={profile} account={sidebarConfig.account} items={sidebarConfig.items} />
      <main className="app-content">
        <AppRoutes profile={profile} setProfile={setProfile} />
      </main>
    </div>
  );
}

export default AppLayout;
