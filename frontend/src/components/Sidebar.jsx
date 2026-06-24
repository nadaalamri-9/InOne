import { memo, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Moon, Sun } from "lucide-react";

import { sidebarItems } from "./sidebarItems";
import logo from "../assets/logo.svg";
import ProfilePic from "../assets/ProfilePic.svg";
import { mediaUrl } from "../services/api";
function normalizeRole(value) {
  const role = String(value || "student").toLowerCase().trim();

  if (role.includes("coach")) return "coach";
  if (role.includes("employer") || role.includes("hiring")) return "employer";
  if (role.includes("admin") || role.includes("manager")) return "admin";
  return "student";
}

function Sidebar({ profile, items = sidebarItems, account = null }) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  const [accountVersion, setAccountVersion] = useState(0);

  useEffect(() => {
    const refreshAccount = () => setAccountVersion((version) => version + 1);
    window.addEventListener("account-settings-updated", refreshAccount);
    window.addEventListener("inone-account-updated", refreshAccount);
    function refreshTheme() {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    }

    window.addEventListener("storage", refreshAccount);
    window.addEventListener("theme-updated", refreshTheme);

    return () => {
      window.removeEventListener("account-settings-updated", refreshAccount);
      window.removeEventListener("inone-account-updated", refreshAccount);
      window.removeEventListener("storage", refreshAccount);
      window.removeEventListener("theme-updated", refreshTheme);
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    setTheme(next);
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event("theme-updated"));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("theme-switching"));
    });
  }

  let currentUser;

  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    currentUser = null;
  }

  const hasProfileData = Boolean(
    profile?.name ||
      profile?.fullName ||
      profile?.firstName ||
      profile?.email ||
      profile?.photoUrl ||
      profile?.photoPreview ||
      profile?.avatar
  );

  accountVersion;

  const displayProfile = account || (hasProfileData ? profile : currentUser) || {};

  const firstName =
    displayProfile?.first_name ||
    displayProfile?.firstName ||
    displayProfile?.name?.split?.(" ")?.[0] ||
    "User";

  const lastName =
    displayProfile?.last_name ||
    displayProfile?.lastName ||
    displayProfile?.name?.split?.(" ")?.slice(1).join(" ") ||
    "";

  const roleLabels = {
    student: "Student",
    coach: "Career Coach",
    employer: "Employer",
    admin: "Admin",
  };

  const rawRole = displayProfile?.title || displayProfile?.role || "Student";
  const normalizedRole = normalizeRole(rawRole);
  const role = roleLabels[normalizedRole] || rawRole;

  const rawAvatarSrc =
    displayProfile?.photoPreview ||
    displayProfile?.photoUrl ||
    displayProfile?.photo_url ||
    displayProfile?.avatar ||
    "";

  const avatarSrc = rawAvatarSrc ? mediaUrl(rawAvatarSrc) : ProfilePic;

  function handleLogout() {
    localStorage.removeItem("inoneToken");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("inone-account-updated"));
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <button
          type="button"
          className="logo-icon"
          onClick={() => navigate("/")}
          aria-label="Go to Home"
          title="Go to Home"
        >
          <img src={logo} alt="InOne Logo" />
        </button>
      </div>

      <button
        type="button"
        className="sidebar-home-btn"
        onClick={() => navigate("/")}
      >
        <Home className="sidebar-home-icon" aria-hidden="true" />
        <span>Home</span>
      </button>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon className="nav-icon" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="user-section">
        <div className="user-profile">
          <img src={avatarSrc} alt="User" className="user-avatar-img" />

          <div className="user-info">
            <p className="user-name">
              {firstName} {lastName}
            </p>
            <span className="user-role">{role}</span>
          </div>

          <button
            type="button"
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <span className="sidebar-theme-icon">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            <span className="sidebar-theme-text">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <LogOut className="logout-icon" aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default memo(Sidebar);