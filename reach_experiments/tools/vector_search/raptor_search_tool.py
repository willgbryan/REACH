import os
from typing import Optional, Type
from raptor import RetrievalAugmentation
from reach_core.utils import get_openai_client

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

# Initialize with default configuration. For advanced configurations, check the documentation. [WIP]
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"

def raptor_add_document(text: str, api_key: str) -> None:
    client = get_openai_client(api_key)
    RA = RetrievalAugmentation()
    RA.add_documents(text)
    
def raptor_retrieve(question: str, api_key: str) -> str:
    client = get_openai_client(api_key)
    RA = RetrievalAugmentation()
    return RA.answer_question(question=question)

