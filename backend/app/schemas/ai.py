from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class PortfolioSummaryRequest(BaseModel):
    profile: Optional[Dict[str, Any]] = None
    projects: Optional[List[Dict[str, Any]]] = None


class PortfolioSummaryResponse(BaseModel):
    summary: str


class ProjectCheckRequest(BaseModel):
    project: Optional[Dict[str, Any]] = None


class ProjectCheckResponse(BaseModel):
    overall_score: int
    ai_likelihood: str  # low / medium / high
    clarity_score: int
    completeness_score: int
    feedback: str
    improvement_suggestions: List[str]
