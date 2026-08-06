"""
Resume analysis engine.

Turns raw resume text + a target role into a structured, explainable score
report. The model is constrained to JSON output; every category score is
then clamped to its rubric maximum and the overall score is *recomputed*
as their sum server-side, so the final numbers are always internally
consistent even if the model's own arithmetic drifts. Nothing here is
resume-specific at the API level — swap the prompt template and rubric for
Job Description Matching or an AI Career Coach later without touching the
FastAPI layer.
"""
import json
import re
from typing import Any, Dict

import google.generativeai as genai

from config import GEMINI_API_KEY, GEMINI_MODEL
from services.roles import get_role_keywords

# Category -> max points. Must sum to 100.
CATEGORY_MAX = {
    "atsCompatibility": 20,
    "structure": 10,
    "skillsMatch": 20,
    "projects": 20,
    "experience": 10,
    "achievements": 5,
    "keywordMatch": 10,
    "writingQuality": 5,
}

CATEGORY_LABELS = {
    "atsCompatibility": "ATS Compatibility",
    "structure": "Resume Structure",
    "skillsMatch": "Skills Match",
    "projects": "Projects",
    "experience": "Experience",
    "achievements": "Achievements",
    "keywordMatch": "Keyword Match",
    "writingQuality": "Writing Quality",
}

ANALYSIS_PROMPT_TEMPLATE = """You are Campus Buddy's Resume Analysis AI, evaluating a resume for the target role: {target_role}.

Score STRICTLY using only the information present in the resume text below.
Never invent experience, projects, skills, metrics, or achievements that are
not present. If a section is missing or something is not stated, say so
explicitly in "missingInformation" instead of guessing or assuming it exists.

Score each category out of its maximum, as an integer:
- atsCompatibility (max 20): ATS-safe formatting, standard section headers, contact information present, readable structure (no tables/columns that break parsing)
- structure (max 10): presence and quality of Summary, Education, Skills, Projects, Experience, Certifications
- skillsMatch (max 20): how well the technical and soft skills listed match a {target_role}
- projects (max 20): complexity, technologies used, real-world impact, problem solving, GitHub/deployment links, quantifiable results
- experience (max 10): internships, leadership, responsibilities, measurable impact
- achievements (max 5): certifications, hackathons, research, awards, open-source contributions
- keywordMatch (max 10): overlap between the resume and this expected keyword list for {target_role}: {role_keywords}
- writingQuality (max 5): grammar, clarity, action verbs, consistency, professionalism

Return ONLY valid JSON with exactly this shape (no markdown fences, no commentary before or after):
{{
  "categoryScores": {{
    "atsCompatibility": {{"score": <integer 0-20>, "explanation": "<specific reason citing the resume>"}},
    "structure": {{"score": <integer 0-10>, "explanation": "<specific reason citing the resume>"}},
    "skillsMatch": {{"score": <integer 0-20>, "explanation": "<specific reason citing the resume>"}},
    "projects": {{"score": <integer 0-20>, "explanation": "<specific reason citing the resume>"}},
    "experience": {{"score": <integer 0-10>, "explanation": "<specific reason citing the resume>"}},
    "achievements": {{"score": <integer 0-5>, "explanation": "<specific reason citing the resume>"}},
    "keywordMatch": {{"score": <integer 0-10>, "explanation": "<specific reason citing the resume>"}},
    "writingQuality": {{"score": <integer 0-5>, "explanation": "<specific reason citing the resume>"}}
  }},
  "strengths": ["<specific strength that references actual resume content>"],
  "weaknesses": ["<specific weakness that references actual resume content>"],
  "foundKeywords": ["<keywords from the expected list that genuinely appear in the resume>"],
  "missingKeywords": ["<keywords from the expected list that do not appear in the resume>"],
  "recommendations": [
    {{"title": "<short title>", "description": "<specific, actionable advice that references resume content>", "category": "<one of: atsCompatibility, structure, skillsMatch, projects, experience, achievements, keywordMatch, writingQuality>"}}
  ],
  "resumeSummary": "<2-3 sentence neutral summary of this candidate, based only on the resume text>",
  "careerReadiness": "<1-2 sentence verdict on readiness for a {target_role} role, referencing specific evidence from the resume>",
  "suggestedImprovements": ["<concrete next step the candidate can take>"],
  "missingInformation": ["<specific expected information that is absent from this resume, if any>"]
}}

Resume text:
{resume_text}
"""


class ResumeAnalyzer:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. Set it in ai/.env before analyzing resumes."
            )
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            GEMINI_MODEL,
            generation_config={"response_mime_type": "application/json"},
        )

    def analyze(self, resume_text: str, target_role: str) -> Dict[str, Any]:
        role_keywords = get_role_keywords(target_role)
        prompt = ANALYSIS_PROMPT_TEMPLATE.format(
            target_role=target_role,
            role_keywords=", ".join(role_keywords) if role_keywords else "general professional keywords",
            resume_text=resume_text,
        )

        response = self.model.generate_content(prompt)
        raw = self._extract_json(response.text)
        return self._normalize(raw, target_role)

    @staticmethod
    def _extract_json(text: str) -> Dict[str, Any]:
        if not text:
            raise ValueError("The AI service returned an empty response.")
        # Defensive: strip markdown code fences in case the model adds them anyway.
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.MULTILINE)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as exc:
            raise ValueError("Could not parse the AI analysis response.") from exc

    @staticmethod
    def _clamp(value: Any, maximum: int) -> int:
        try:
            value = round(float(value))
        except (TypeError, ValueError):
            value = 0
        return max(0, min(maximum, value))

    @staticmethod
    def _status_for(score: int, max_points: int) -> str:
        ratio = score / max_points if max_points else 0
        if ratio >= 0.85:
            return "excellent"
        if ratio >= 0.6:
            return "good"
        return "needs-improvement"

    def _normalize(self, raw: Dict[str, Any], target_role: str) -> Dict[str, Any]:
        raw_categories = raw.get("categoryScores", {}) if isinstance(raw, dict) else {}
        category_scores = {}
        total = 0

        for key, max_points in CATEGORY_MAX.items():
            entry = raw_categories.get(key, {}) if isinstance(raw_categories, dict) else {}
            score = self._clamp(entry.get("score", 0) if isinstance(entry, dict) else 0, max_points)
            total += score
            category_scores[key] = {
                "label": CATEGORY_LABELS[key],
                "score": score,
                "max": max_points,
                "explanation": (entry.get("explanation") if isinstance(entry, dict) else "") or "",
                "status": self._status_for(score, max_points),
            }

        ats_score = round(
            (category_scores["atsCompatibility"]["score"] / CATEGORY_MAX["atsCompatibility"]) * 100
        )

        return {
            "targetRole": target_role,
            "overallScore": total,
            "atsScore": ats_score,
            "categoryScores": category_scores,
            "strengths": raw.get("strengths") or [],
            "weaknesses": raw.get("weaknesses") or [],
            "foundKeywords": raw.get("foundKeywords") or [],
            "missingKeywords": raw.get("missingKeywords") or [],
            "recommendations": raw.get("recommendations") or [],
            "resumeSummary": raw.get("resumeSummary") or "",
            "careerReadiness": raw.get("careerReadiness") or "",
            "suggestedImprovements": raw.get("suggestedImprovements") or [],
            "missingInformation": raw.get("missingInformation") or [],
        }
