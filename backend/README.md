# InOne Backend

FastAPI + SQLite backend for the InOne portfolio platform.

## Project Summary

The backend exposes a REST API (under `/api`) for authentication, student
profiles and projects, public portfolios, and role-specific dashboards for
coaches, employers, and admins. It also provides an AI layer for generating
portfolio summaries and reviewing project content. Data is stored in SQLite and
managed with SQLAlchemy + Alembic; uploaded files (photos, resumes, screenshots)
are served as static assets.

### Tech Stack

- **FastAPI** — API framework
- **SQLAlchemy** — ORM
- **Alembic** — database migrations
- **SQLite** (`InOne.db`) — database
- **bcrypt** — password hashing
- **python-jose** — JWT authentication
- **python-multipart / aiofiles** — file uploads
- **OpenAI** — AI portfolio summary and project checking

---

## Requirements

- Python 3.11+
- pip (and `venv`)
- *(Optional)* an OpenAI API key for live AI features

---

## Installation

```bash
cd InOne/backend

# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# 2. Install dependencies
pip install -r requirements.txt
```

---

## Run the Project

```bash
# 1. Create the environment file (see API Keys & Environment Variables below)
#    backend/.env

# 2. Run database migrations (creates InOne.db) — first run only
alembic upgrade head

# 3. Start the server
uvicorn app.main:app --reload
```

The API runs at **http://127.0.0.1:8000** — interactive docs at
**http://127.0.0.1:8000/docs**.

---

## API Keys & Environment Variables

Create `backend/.env` with the variables below. The app reads them on startup
(via `python-dotenv`). It runs with the defaults shown, but you should change
`SECRET_KEY` for any non-local use and set `OPENAI_API_KEY` for real AI output.

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./InOne.db` | SQLite database path |
| `SECRET_KEY` | `change-this-secret-key` | JWT signing key — change in production |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Token lifetime |
| `LLM_PROVIDER` | `openai` | LLM provider |
| `OPENAI_API_KEY` | *(empty)* | OpenAI key — app works without it (uses mock) |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `FRONTEND_URL` | `http://localhost:5173` | React frontend URL (for CORS) |

---

## Known Issues

- **No `.env.example` is committed** — create `backend/.env` manually using the
  table above.
- **AI uses a mock without `OPENAI_API_KEY`** — `/api/ai/*` endpoints return
  placeholder data until a key is configured.
- **`POST /api/auth/forgot-password` is a placeholder** — no email/reset flow.
- **SQLite only** — no production database configuration is provided.

---

## API Routes

All routes are prefixed with `/api`.

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Password reset placeholder |

### Profile (student)
| Method | Path | Description |
|---|---|---|
| GET | `/api/profile/me` | Get my profile |
| PUT | `/api/profile/me` | Update my profile |
| POST | `/api/profile/photo` | Upload profile photo |
| DELETE | `/api/profile/photo` | Delete profile photo |
| POST | `/api/profile/resume` | Upload resume PDF |
| DELETE | `/api/profile/resume` | Delete resume |

### Projects
| Method | Path | Description |
|---|---|---|
| GET | `/api/projects/me` | Get my projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/{id}` | Get project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |
| PATCH | `/api/projects/{id}/status` | Update status |
| PATCH | `/api/projects/{id}/publish` | Publish project |
| POST | `/api/projects/{id}/screenshots` | Upload screenshot |
| DELETE | `/api/projects/{id}/screenshots/{sid}` | Delete screenshot |

### Portfolio
| Method | Path | Description |
|---|---|---|
| GET | `/api/portfolio/me` | My full portfolio |
| GET | `/api/portfolio/share/{slug}` | Public portfolio by slug |
| GET | `/api/portfolio/public` | Browse public portfolios |
| GET | `/api/me/portfolio/share` | Share settings |
| PATCH | `/api/me/portfolio/visibility` | Update visibility |
| POST | `/api/me/portfolio/share/regenerate` | Regenerate share token |
| GET | `/api/students/{id}` | Student portfolio by user ID |

### Coach
| Method | Path | Description |
|---|---|---|
| GET | `/api/coach/dashboard` | Coach dashboard stats |
| GET | `/api/coach/students` | List students |
| GET | `/api/coach/projects` | Projects needing review |
| GET | `/api/coach/projects/{id}` | Project detail |
| POST | `/api/coach/projects/{id}/feedback` | Add feedback |

### Employer
| Method | Path | Description |
|---|---|---|
| GET | `/api/employer/dashboard` | Dashboard + stats |
| GET | `/api/employer/candidates` | Browse candidates |
| GET | `/api/employer/saved` | Saved portfolios |
| POST | `/api/employer/saved/{student_id}` | Save portfolio |
| DELETE | `/api/employer/saved/{student_id}` | Unsave portfolio |

### Admin
| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/{id}` | Get user |
| PATCH | `/api/admin/users/{id}/role` | Change user role |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/portfolios` | List all portfolios |

### AI
| Method | Path | Description |
|---|---|---|
| POST | `/api/ai/portfolio-summary` | Generate portfolio summary |
| POST | `/api/ai/project-check/{id}` | Analyze project content |

---

## File Uploads

Uploaded files are stored under `app/uploads/`:

- **Profile pictures**: `/uploads/profile_pictures/`
- **Resumes**: `/uploads/resumes/`
- **Project screenshots**: `/uploads/project_screenshots/`

Served as static files at the same paths: `http://127.0.0.1:8000/uploads/...`
