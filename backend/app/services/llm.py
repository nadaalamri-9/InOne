"""
LLM service — wraps OpenAI (or mock) for portfolio summary and project check.
Falls back to structured mock responses when no API key is set.
"""
import json
from ..config import get_settings

settings = get_settings()


def _get_openai_client():
    if not settings.openai_api_key or settings.openai_api_key == "your_api_key_here":
        return None
    try:
        from openai import OpenAI
        return OpenAI(api_key=settings.openai_api_key)
    except Exception:
        return None


def _chat(messages: list, temperature: float = 0.7) -> str | None:
    client = _get_openai_client()
    if not client:
        return None
    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content
    except Exception:
        return None


# ── Portfolio Summary ─────────────────────────────────────────────────────────

def generate_portfolio_summary(profile: dict, projects: list) -> str:
    name = f"{profile.get('first_name', '')} {profile.get('last_name', '')}".strip() or "The student"
    role = profile.get("role") or profile.get("headline") or "Professional"
    bio = profile.get("bio") or profile.get("about_me") or ""
    location = profile.get("location") or ""
    skills = [s["name"] if isinstance(s, dict) else s for s in profile.get("skills", [])]
    target_roles = [t["name"] if isinstance(t, dict) else t for t in profile.get("target_roles", [])]
    educations = profile.get("education", [])
    certifications = profile.get("certifications", [])

    pub_projects = [
        p for p in projects
        if str(p.get("status", "")).lower() == "published"
    ]

    project_summaries = []
    for p in pub_projects[:5]:
        title = p.get("title", "Untitled")
        summary = p.get("summary", "")
        tools = [t["name"] if isinstance(t, dict) else t for t in p.get("tools", [])]
        results = p.get("results", "")
        project_summaries.append(
            f"- {title}: {summary}. Tools: {', '.join(tools)}. Results: {results}"
        )

    education_text = "\n".join(
        f"- {e.get('degree', '')} from {e.get('school', '')} ({e.get('year', '')})"
        for e in educations
    )
    cert_text = "\n".join(
        f"- {c.get('name', '')} ({c.get('year', '')})"
        for c in certifications
    )

    system_prompt = (
        "You are a professional career coach. Write a compelling, employer-facing "
        "portfolio summary for the student described below. Keep it under 200 words. "
        "Sound professional, confident, and specific."
    )

    user_prompt = f"""Student: {name}
Role/Track: {role}
Location: {location}
Bio: {bio}
Skills: {', '.join(skills)}
Target Roles: {', '.join(target_roles)}
Education:
{education_text}
Certifications:
{cert_text}
Published Projects:
{chr(10).join(project_summaries) or "None yet"}

Write a professional portfolio summary paragraph."""

    result = _chat([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ])

    if result:
        return result.strip()

    # Mock fallback
    skills_text = ", ".join(skills[:4]) if skills else "various technical skills"
    projects_text = f"{len(pub_projects)} published project(s)" if pub_projects else "several projects"
    return (
        f"{name} is a motivated {role} based in {location or 'Saudi Arabia'} with expertise in "
        f"{skills_text}. With {projects_text} showcasing real-world problem-solving, "
        f"{name} demonstrates a strong ability to apply technical knowledge to deliver impactful solutions. "
        f"Eager to contribute to innovative teams and continue growing professionally."
    )


# ── Project Content Check ─────────────────────────────────────────────────────

def check_project_content(project: dict) -> dict:
    title = project.get("title", "Untitled")
    summary = project.get("summary", "")
    overview = project.get("overview", "")
    business_problem = project.get("business_problem", "")
    solution = project.get("solution", "")
    architecture = project.get("architecture", "")
    role = project.get("role", "")
    results = project.get("results", "")
    features = [f["name"] if isinstance(f, dict) else f for f in project.get("features", [])]
    tools = [t["name"] if isinstance(t, dict) else t for t in project.get("tools", [])]

    system_prompt = """You are an expert technical portfolio reviewer.
Analyze the project description and return a JSON object with EXACTLY these fields:
{
  "overall_score": <int 0-100>,
  "ai_likelihood": "<low|medium|high>",
  "clarity_score": <int 0-100>,
  "completeness_score": <int 0-100>,
  "feedback": "<one concise paragraph of overall feedback>",
  "improvement_suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}
Return ONLY the JSON, no other text."""

    user_prompt = f"""Project: {title}

Summary: {summary}
Overview: {overview}
Business Problem: {business_problem}
Solution: {solution}
Architecture: {architecture}
My Role: {role}
Results: {results}
Features: {', '.join(features)}
Tools: {', '.join(tools)}

Analyze and return the JSON evaluation."""

    result = _chat([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ], temperature=0.3)

    if result:
        try:
            # Strip potential markdown code fences
            clean = result.strip()
            if clean.startswith("```"):
                clean = "\n".join(clean.split("\n")[1:])
            if clean.endswith("```"):
                clean = "\n".join(clean.split("\n")[:-1])
            return json.loads(clean)
        except (json.JSONDecodeError, ValueError):
            pass

    # Mock fallback — score based on content length heuristic
    filled = sum(bool(v) for v in [summary, overview, business_problem, solution, architecture, role, results])
    score = min(95, filled * 13 + 5)

    return {
        "overall_score": score,
        "ai_likelihood": "low",
        "clarity_score": min(100, score + 5),
        "completeness_score": score,
        "feedback": (
            f"The project '{title}' has a solid foundation. "
            "Make sure all sections are filled with specific, quantifiable details. "
            "Use concrete metrics in your results section to demonstrate impact."
        ),
        "improvement_suggestions": [
            "Add specific metrics and numbers to the Results section (e.g., 'reduced load time by 40%')",
            "Expand the Business Problem section with more context about why this problem matters",
            "Include architectural diagrams or detailed descriptions of your technical choices",
            "Describe your personal contributions more specifically in the Role section",
            "Add links to GitHub repository or live demo if available",
        ],
    }
