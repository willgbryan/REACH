from typing import Optional, Type

import requests
from bs4 import BeautifulSoup

from langchain.tools import BaseTool, StructuredTool, tool
from langchain.pydantic_v1 import BaseModel, Field
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

def fetch_html(url: str) -> str:
    response = requests.get(url)
    return response.content.decode("utf-8")

class HTMLExtractionInput(BaseModel):
    html_url: str = Field(description="should be a url ending in .html")

class HTMLExtractionTool(BaseTool):
    """Tool that returns page contents given a valid URL that ends in .html."""

    name = "html_extraction"
    description = "A function for useful for when you need extract html from a web URL ending in .html. Input should be a valid URL that ends with .html"
    args_schema: Type[BaseModel] = HTMLExtractionInput

    def _run(
        self, html_url: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        raw_text = fetch_html(html_url)

        soup = BeautifulSoup(raw_text, 'html.parser')

        return soup.prettify()

    async def _arun(
        self, html_url: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        raw_text = fetch_html(html_url)

        soup = BeautifulSoup(raw_text, 'html.parser')

        return soup.prettify()