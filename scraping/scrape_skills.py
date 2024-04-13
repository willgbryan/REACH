from langchain.document_loaders import PyMuPDFLoader
from langchain.retrievers import ArxivRetriever
from youtube_transcript_api import YouTubeTranscriptApi



def scrape_pdf_with_pymupdf(url) -> str:
    """Scrape a pdf with pymupdf

    Args:
        url (str): The url of the pdf to scrape

    Returns:
        str: The text scraped from the pdf
    """
    loader = PyMuPDFLoader(url)
    doc = loader.load()
    return str(doc)


def scrape_pdf_with_arxiv(query) -> str:
    """Scrape a pdf with arxiv
    default document length of 70000 about ~15 pages or None for no limit

    Args:
        query (str): The query to search for

    Returns:
        str: The text scraped from the pdf
    """
    retriever = ArxivRetriever(load_max_docs=2, doc_content_chars_max=None)
    docs = retriever.get_relevant_documents(query=query)
    return docs[0].page_content

def scrape_youtube_transcripts(url: str) -> str:
    """Scrape transcript from a Youtube video url
    
    Args:
        url (str): The video url to scrape
        
    Returns:
        str: The transcript from the video
    """

    video_id = url.replace('https://www.youtube.com/watch?v=', '')
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    output=''

    for x in transcript:
        sentence = x['text']
        output += f' {sentence}\n'

    return output