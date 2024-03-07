import pprint
import asyncio
from langchain_openai import ChatOpenAI
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool, StructuredTool, tool
from langchain_community.document_loaders import AsyncChromiumLoader
from langchain.chains import create_extraction_chain
from langchain_community.document_transformers import BeautifulSoupTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

from typing import Optional, Type

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

#TODO parametrize this 
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613")

schema = {
    "properties": {
        "title": {"type": "string"},
        "key_findings": {"type": "string"},
        "body_text": {"type": "string"},
    },
    "required": ["title", "key_findings", "body_text"],
}

def extract(content: str, schema: dict):
    return create_extraction_chain(schema=schema, llm=llm).run(content)


class UrlInput(BaseModel):
    url: str = Field(description="Should be a web url such as: https://www.espn.com")


class UrlExtractionTool(BaseTool):
    """Tool that returns page contents given a valid website URL."""

    name = "website_extraction"
    description = "A function for useful for when you need extract webpage information from a URL. Input should be a valid URL that does not end in a file extension such as '.pdf' or '.html'."
    args_schema: Type[BaseModel] = UrlInput

    def _run(
        self, url: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""

        urls = [url]
        loader = AsyncChromiumLoader(urls)
        docs = loader.load()
        bs_transformer = BeautifulSoupTransformer()
        docs_transformed = bs_transformer.transform_documents(
            docs, tags_to_extract=["div", "p", "span", "li"]
        )

        # chunk size can be adjusted
        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=1000, chunk_overlap=50
        )
        splits = splitter.split_documents(docs_transformed)
        if not splits:
            print("No content was split from the document.")
            return "No content extracted."
        extracted_content = extract(schema=schema, content=splits[0].page_content)
        pprint.pprint(extracted_content)
        return extracted_content

    async def _arun(
        self, url: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        urls = [url]
        loader = AsyncChromiumLoader(urls)
        docs = await loader.load()  # Use await for async operation
        # await asyncio.sleep(5)
        bs_transformer = BeautifulSoupTransformer()
        docs_transformed = bs_transformer.transform_documents(
            docs, tags_to_extract=["div", "p", "span", "li"]
        )

        # chunk size can be adjusted
        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=1000, chunk_overlap=50
        )
        splits = splitter.split_documents(docs_transformed)

        extracted_content = extract(schema=schema, content=splits[0].page_content)
        pprint.pprint(extracted_content)
        return extracted_content