import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import StudentDashboard from "../pages/student/Dashboard";
import StudentProfile from "../pages/student/Profile";
import StudentPortfolio from "../pages/student/Portfolio";
import StudentFeedback from "../pages/student/Feedback";
import ShareableLink from "../pages/student/ShareableLink";

import CoachDashboard from "../pages/coach/Dashboard";
import CoachProjects from "../pages/coach/Projects";
import CoachStudents from "../pages/coach/Students";

import EmployerDashboard from "../pages/employer/Dashboard";
import Candidates from "../pages/employer/Candidates";
import SavedCandidates from "../pages/employer/SavedCandidates";
import Messages from "../pages/employer/Messages";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";

import PortfolioView from "../pages/shared/PortfolioView";
import Portfolios from "../pages/shared/Portfolios";
import Privacy from "../pages/shared/Privacy";
import Terms from "../pages/shared/Terms";
import Contact from "../pages/shared/Contact";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/portfolio" element={<StudentPortfolio />} />
        <Route path="/student/feedback" element={<StudentFeedback />} />
        <Route path="/student/share-link" element={<ShareableLink />} />

        {/* Coach */}
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="/coach/projects" element={<CoachProjects />} />
        <Route path="/coach/students" element={<CoachStudents />} />

        {/* Employer */}
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/candidates" element={<Candidates />} />
        <Route path="/employer/saved" element={<SavedCandidates />} />
        <Route path="/employer/messages" element={<Messages />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        {/* Shared */}
        <Route path="/portfolio/:id" element={<PortfolioView />} />
        <Route path="/portfolios" element={<Portfolios />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;