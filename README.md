# InOne

A role-based **portfolio platform**. Students build and share project portfolios;
coaches, employers, and admins interact with them through dedicated dashboards.

The repo is split into two apps:

| Folder | Stack | Purpose |
|--------|-------|---------|
| [`backend/`](backend/) | FastAPI · SQLAlchemy · Alembic · SQLite | REST API, auth, AI summaries |
| [`frontend/`](frontend/) | React 19 · Vite · React Router | Web UI (public site + role dashboards) |

Roles: **student**, **coach**, **employer**, **admin**.

---

## Project Summary

InOne lets students create portfolios of their projects (with screenshots,
resumes, and links) and share them publicly via a slug. Coaches review student
work and leave feedback, employers browse and save candidate portfolios, and
admins manage users and platform-wide content. An optional AI layer generates
portfolio summaries and reviews project content.

---

## Requirements

- **Python** 3.11+
- **Node.js** 18+
- **npm** (ships with Node.js)
- *(Optional)* An **OpenAI API key** — AI features fall back to a mock when unset.

---

## Installation

Clone the repo, then install each app's dependencies.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

---

## Run the Project

Run the backend and frontend in two terminals.

### 1. Backend (`http://127.0.0.1:8000`)

```bash
cd backend
source venv/bin/activate
alembic upgrade head              # create InOne.db (first run only)
uvicorn app.main:app --reload
```

Interactive API docs: **http://127.0.0.1:8000/docs**

### 2. Frontend (`http://localhost:5173`)

```bash
cd frontend
npm run dev
```

Other frontend scripts: `npm run build`, `npm run preview`, `npm run lint`.

---

## API Keys & Environment Variables

Secrets live in untracked `.env` files — one per app. Create each file by hand
(there is no committed `.env.example`; see Known Issues).

| App | File | Key settings |
|-----|------|--------------|
| backend | `backend/.env` | `DATABASE_URL`, `SECRET_KEY`, `OPENAI_API_KEY`, `FRONTEND_URL` |
| frontend | `frontend/.env` | `VITE_API_BASE_URL` |

The only external account needed is an **OpenAI API key** for live AI summaries;
without it the app uses a built-in mock. See [`backend/README.md`](backend/README.md)
for the full list of backend variables and defaults.

---

## Known Issues

- **No `.env.example` files are committed.** You must create `backend/.env` and
  `frontend/.env` by hand using the tables above before running.
- **AI features require an OpenAI key.** Without `OPENAI_API_KEY`, summaries and
  project checks return mock data rather than real output.
- **`forgot-password` is a placeholder** — it does not send email or reset
  credentials yet.
- **SQLite only.** The default database is local SQLite (`backend/InOne.db`);
  no production/Postgres configuration is provided.

---

## More Docs

- [`backend/README.md`](backend/README.md) — API routes, tech stack, file uploads
- [`frontend/README.md`](frontend/README.md) — page/route map and project structure
