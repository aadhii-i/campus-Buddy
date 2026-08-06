"""
Target role registry.

Each role maps to the keyword/skill vocabulary a resume is evaluated
against for the "Keyword Match" and "Skills Match" categories. Kept
separate from the scoring logic so the same table can be reused by other
role-aware features later (Job Description Matching, AI Career Coach)
without touching the analyzer itself.
"""
from typing import List

TARGET_ROLES = {
    "Software Engineer": [
        "Data Structures", "Algorithms", "System Design", "Object-Oriented Design",
        "Git", "REST API", "Unit Testing", "CI/CD", "SQL", "Java", "Python", "C++",
        "Debugging", "Design Patterns", "Agile", "Cloud (AWS/GCP/Azure)"
    ],
    "Full Stack Developer": [
        "React", "Node.js", "Express", "JavaScript", "TypeScript", "HTML/CSS",
        "REST API", "MongoDB", "SQL", "Git", "Docker", "Authentication",
        "Deployment", "CI/CD", "Responsive Design", "Testing"
    ],
    "Backend Developer": [
        "Node.js", "Express", "Django", "Spring Boot", "REST API", "GraphQL",
        "SQL", "NoSQL", "MongoDB", "PostgreSQL", "Redis", "Microservices",
        "Docker", "Kubernetes", "Authentication", "System Design", "Caching"
    ],
    "Data Scientist": [
        "Python", "Pandas", "NumPy", "Scikit-learn", "Machine Learning",
        "Statistics", "Data Visualization", "SQL", "Jupyter", "Feature Engineering",
        "A/B Testing", "Deep Learning", "TensorFlow", "PyTorch", "Data Cleaning"
    ],
    "Machine Learning Engineer": [
        "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning",
        "Model Deployment", "MLOps", "Feature Engineering", "Neural Networks",
        "NLP", "Computer Vision", "Docker", "Cloud (AWS/GCP/Azure)", "SQL",
        "Model Optimization", "Data Pipelines"
    ],
    "Data Analyst": [
        "SQL", "Excel", "Power BI", "Tableau", "Python", "Pandas",
        "Data Visualization", "Statistics", "Dashboarding", "A/B Testing",
        "Data Cleaning", "Reporting", "ETL", "Google Analytics"
    ],
}


def get_role_keywords(role: str) -> List[str]:
    return TARGET_ROLES.get(role, [])


def list_roles() -> List[str]:
    return list(TARGET_ROLES.keys())


def is_valid_role(role: str) -> bool:
    return role in TARGET_ROLES
