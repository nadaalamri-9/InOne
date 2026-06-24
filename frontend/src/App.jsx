import "./styles/ComponentShared.css";
import "./styles/AppShell.css";
import "./pages/admin/AdminDashboardPage.css";
import "./pages/coach/CoachDashboardPage.css";
import "./pages/employer/EmployerDashboardPage.css";
import "./pages/shared/Portfolios.css";
import "./pages/shared/SettingsPage.css";
import "./pages/student/StudentDashboard.css";
import "./pages/home/HomePage.css";
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createEmptyProfile } from './pages/student/profile/services/profileApi'
import AppLayout from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [profile, setProfile] = useState(createEmptyProfile());

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout profile={profile} setProfile={setProfile} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
