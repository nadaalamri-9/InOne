import { useEffect, useMemo, useRef, useState } from "react";
import { Moon, Sun, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/ProfilePic.svg";
import { mediaUrl } from "../services/api";
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

function normalizeRole(value) {
  const role = String(value || "student").toLowerCase().trim();

  if (role.includes("coach")) return "coach";
  if (role.includes("employer") || role.includes("hiring")) return "employer";
  if (role.includes("admin") || role.includes("manager")) return "admin";
  return "student";
}

function getDashboardPath(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "coach") return "/coach/dashboard";
  if (normalizedRole === "employer") return "/employer/dashboard";
  if (normalizedRole === "admin") return "/admin/dashboard";
  return "/dashboard";
}

function getSettingsPath(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "coach") return "/coach/settings";
  if (normalizedRole === "employer") return "/employer/settings";
  if (normalizedRole === "admin") return "/admin/settings";
  return "/settings";
}

export default function Navbar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  const firstName = currentUser?.first_name || currentUser?.firstName || "";
  const lastName = currentUser?.last_name || currentUser?.lastName || "";
  const fullName = currentUser?.fullName || currentUser?.name || `${firstName} ${lastName}`.trim() || "User";
  const displayName = `${firstName} ${lastName}`.trim() || fullName;
  const role = normalizeRole(currentUser?.role);
  const rawAvatar =
  currentUser?.photoUrl ||
  currentUser?.photo_url ||
  currentUser?.avatar ||
  "";

const avatar = rawAvatar ? mediaUrl(rawAvatar) : defaultAvatar;

  const dashboardPath = useMemo(() => getDashboardPath(role), [role]);
  const settingsPath = useMemo(() => getSettingsPath(role), [role]);

  useEffect(() => {
    function refreshUser() {
      setCurrentUser(getCurrentUser());
    }

    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("storage", refreshUser);
    window.addEventListener("account-settings-updated", refreshUser);
    window.addEventListener("inone-account-updated", refreshUser);
    function refreshTheme() {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    }

    document.addEventListener("mousedown", closeMenu);
    window.addEventListener("theme-updated", refreshTheme);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("account-settings-updated", refreshUser);
      window.removeEventListener("inone-account-updated", refreshUser);
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("theme-updated", refreshTheme);
    };
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    setTheme(nextTheme);
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("theme-updated"));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("theme-switching"));
    });
  }

  function handleLogout() {
    localStorage.removeItem("inoneToken");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event("inone-account-updated"));
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/logo.svg" alt="InOne" />
        </a>

        <nav className="navbar-links">
          <a href="#IMPACT">INONE IMPACT</a>
          <a href="#PORTFOLIOS">EXPLORE PORTFOLIOS</a>
          <a href="#HOW">HOW IT WORKS</a>
          <a href="#FAQ">FAQ</a>
        </nav>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {currentUser ? (
            <div className="navbar-user-menu" ref={menuRef}>
              <button
                className="navbar-user-trigger"
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                aria-expanded={isMenuOpen}
              >
                <span className="navbar-welcome">
                  Welcome, {displayName}
                </span>

                <img src={avatar} alt={displayName} />

                <ChevronDown size={16} />
              </button>

              {isMenuOpen && (
                <div className="navbar-dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(dashboardPath);
                    }}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(settingsPath);
                    }}
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button type="button" onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="auth-btn"
                type="button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="auth-btn"
                type="button"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
