"""
Document parsing.

Only knows how to turn a file on disk into plain text. Swapping the PDF
backend or adding support for another file type (docx, txt, ...) only
touches this module.
"""
import fitz  # PyMuPDF


def extract_text_from_pdf(file_path: str) -> str:
    """Extract and concatenate the text of every page in a PDF."""
    pages = []
    with fitz.open(file_path) as document:
        for page in document:
            pages.append(page.get_text())
    return "\n".join(pages).strip()
