import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { cleanupLegacyLocalStorage } from './services/api.js'
import "./styles/global.css";

// Remove stale mock portfolio/project data from old localStorage builds.
cleanupLegacyLocalStorage();

// InOne theme init (light/dark)
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
