from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool, StructuredTool, tool
from langchain_community.document_loaders import AsyncHtmlLoader
from langchain_community.document_transformers import Html2TextTransformer


from typing import Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)


class UrlInput(BaseModel):
    url: str = Field(description="Should be a web url such as: https://www.espn.com")


class UrlExtractionTool(BaseTool):
    name = "url_text_extraction"
    description = "useful for when you need extract webpage information from a URL"
    args_schema: Type[BaseModel] = UrlInput

    def _run(
        self, url: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        urls = [url]
        loader = AsyncHtmlLoader(urls)
        docs = loader.load()
        html2text = Html2TextTransformer()
        docs_transformed = html2text.transform_documents(docs)

        # This can be adjusted to include or exclude more text
        return docs_transformed[0].page_content[0:500]

    # async def _arun(
    #     self, query: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    # ) -> str:
    #     """Use the tool asynchronously."""
    #     raise NotImplementedError("custom_search does not support async")

