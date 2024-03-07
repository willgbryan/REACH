from typing import Optional, Type

import fitz
import requests 

from langchain.tools import BaseTool, StructuredTool, tool
from langchain.pydantic_v1 import BaseModel, Field
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

def fetch_pdf(url: str) -> bytes:
    response = requests.get(url)
    return response.content

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

class PDFExtractionInput(BaseModel):
    pdf_url: str = Field(description="should be a url ending in .pdf")

class PDFExtractionTool(BaseTool):
    """Tool that returns page contents given a valid URL that ends in .pdf."""

    name = "pdf_extraction"
    description = "A function for useful for when you need extract text from a web URL ending in .pdf. Input should be a valid URL that ends with .pdf"
    args_schema: Type[BaseModel] = PDFExtractionInput

    def _run(
        self, pdf_url: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        pdf_bytes = fetch_pdf(pdf_url)

        raw_text = extract_text_from_pdf(pdf_bytes)

        return raw_text

    async def _arun(
        self, pdf_url: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        pdf_bytes = fetch_pdf(pdf_url)

        raw_text = extract_text_from_pdf(pdf_bytes)

        return raw_text