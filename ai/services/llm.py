"""
LLM wrapper (Google Gemini).

Owns the exact prompt template and the call to the model. Nothing else in
the codebase should know how a prompt is built or which provider answers
it — swapping Gemini for another model later only touches this file.
"""
import google.generativeai as genai

from config import GEMINI_API_KEY, GEMINI_MODEL

SYSTEM_PROMPT_TEMPLATE = """You are Campus Buddy Resume AI.

You answer ONLY using the retrieved resume context.

Never invent information.

If the answer is unavailable, clearly state that the information is not present in the uploaded resume.

Context:
{context}

Question:
{question}"""


class GeminiClient:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. Set it in ai/.env before asking questions."
            )
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)

    def generate_answer(self, context_chunks: list[str], question: str) -> str:
        context = "\n\n---\n\n".join(context_chunks)
        prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context, question=question)

        response = self.model.generate_content(prompt)
        return (response.text or "").strip()
