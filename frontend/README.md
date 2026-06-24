# InOne Frontend

React 19 + Vite single-page app for the InOne portfolio platform.

## Project Summary

The frontend is one cohesive website: an InOne-styled public front (landing,
auth, and legal pages) leading into the full role-based application for
students, coaches, employers, and admins. It talks to the [backend](../backend/)
REST API for all data. The whole product uses a single InOne design system with
glass surfaces, a pink/violet palette, and light/dark themes.

### Tech Stack

- **React 19** — UI
- **Vite** — dev server & build
- **React Router 7** — routing
- **lucide-react** — icons

---

## Requirements

- Node.js 18+
- npm
- The InOne **backend** running (default `http://127.0.0.1:8000`) for live data

---

## Installation

```bash
cd frontend
npm install
```

---

## Run the Project

```bash
npm run dev        # development server (http://localhost:5173)
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # run ESLint
```

Open the URL Vite prints (default **http://localhost:5173**).

---

## API Keys & Environment Variables

No API keys are needed in the frontend. Create `frontend/.env` with a single
variable pointing at the backend:

| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | Base URL of the InOne backend API |

Vite only exposes variables prefixed with `VITE_` to the app. Restart the dev
server after changing `.env`.

---

## Known Issues

- **No `.env.example` is committed** — create `frontend/.env` manually with
  `VITE_API_BASE_URL`.
- **Requires the backend** — pages that fetch data will be empty or error if the
  backend isn't running and reachable at `VITE_API_BASE_URL`.
- **In-app area is anchored to light mode** — the theme toggle fully affects the
  public site and shared chrome; the original application pages were authored as
  light UIs.

---

## Site Map

### Public site (InOne design, no sidebar)
| Path | Page |
|------|------|
| `/` | Landing page (Hero, Stats, Explore Portfolios, How it Works, FAQ, CTA) |
| `/login` | Login |
| `/signup` | Sign up |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/contact` | Contact |

### Application (with the InOne glass sidebar)
- **Student:** `/dashboard`, `/profile`, `/project`, `/feedback`, `/portfolio`, `/share`, `/settings`
- **Coach:** `/coach/dashboard`, `/coach/students`, `/coach/projects`, `/coach/feedback`, `/coach/profile`, `/coach/settings`
- **Employer:** `/employer/dashboard`, `/employer/candidates`, `/employer/saved`, `/employer/settings`
- **Admin:** `/admin/dashboard`, `/admin/users`, `/admin/settings`

Login routes to the right area by role. Sign-up assigns a role from the first
letter of the user ID: S = student, C = coach, E = employer, A = admin.

---

## Design System (notes)

The whole app uses **only InOne's design tokens** — there are no leftover legacy
colours, fonts, or surfaces. Key files:

- **`src/index.css`** — InOne design tokens (Source Sans 3 font, pink/violet
  palette, gradient background, light/dark theme variables, base resets).
- **`src/styles/inone-skin.css`** — finishing touches: glass blur on cards,
  gradient pill buttons, glass form fields.
- **`src/styles/inone-design.css`** — the authoritative shared design system,
  loaded LAST and scoped to `.app-shell`, so it governs page headers, cards,
  stat tiles, buttons, badges, forms, tables, avatars, and entrance animations
  across all app pages while leaving the public site pristine.
- **`src/styles/inone-theme.css`** — reference copy of InOne's original global CSS.
- **`src/layouts/Sidebar/Sidebar.css`** — the app sidebar in InOne's glass style.
- **`src/site/`** — the InOne public site, wired into the router in
  `src/app/App.jsx`.

### Theming
The app uses the same `[data-theme]` tokens as the public site; a theme toggle
in the app sidebar (sun/moon) switches light/dark and persists the choice to
`localStorage`. Status colours (green/amber/red) are kept so badges retain their
meaning. Dark mode uses brighter accents (`#f15ba6` / `#b3aef8`) for contrast;
light mode uses the deeper `#c8246c`. Focus-visible rings are present on
interactive elements for keyboard users.
