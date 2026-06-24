from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .config import get_settings
from .database import Base, engine
from . import models
from .routes import auth, profile, projects, portfolio, coach, employer, admin, ai

settings = get_settings()


UPLOAD_BASE = Path(__file__).parent / "uploads"
for sub in ("profile_pictures", "resumes", "project_screenshots"):
    (UPLOAD_BASE / sub).mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="InOne API",
    description="Backend API for the InOne portfolio platform",
    version="1.0.0",
)
## for the Admin role in the live link
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models.user import User, UserRole

def ensure_admin():
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(
            User.email == "shaohua@inone.com"
        ).first()

        if user:
            user.role = UserRole.admin
            db.commit()
    finally:
        db.close()

ensure_admin()

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/uploads", StaticFiles(directory=str(UPLOAD_BASE)), name="uploads")


API_PREFIX = "/api"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(profile.router, prefix=API_PREFIX)
app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(portfolio.router, prefix=API_PREFIX)
app.include_router(coach.router, prefix=API_PREFIX)
app.include_router(employer.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)
app.include_router(ai.router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {"message": "InOne API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
