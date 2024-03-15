from raptor import RetrievalAugmentation
from reach_core.utils import get_openai_client
from reach_core.tools.unstructured_connectors import unstructured_utils

def raptor_add_document(text: str, client) -> None:
    client = client
    RA = RetrievalAugmentation()
    RA.add_documents(text)

for file_path in file_list:
    pdf_text = unstructured_utils.process_pdf_in_container(
        container_name: "unstructured", 
        local_pdf_path: file_path
    )
    raptor_add_document(pdf_text, client)

