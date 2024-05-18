from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import json
import os
import aiofiles
from typing import List
from reach_core.utils.websocket_manager import WebSocketManager
from reach_core.utils.unstructured_functions import *
from reach_core.utils.whisper_functions import *
from reach_core.utils.mp3_from_mp4 import mp4_to_mp3
from .utils import write_md_to_pdf


class ResearchRequest(BaseModel):
    task: str
    report_type: str
    agent: str
    sources: List[str] = []

class SalesforceCredentials(BaseModel):
    username: str
    consumer_key: str
    private_key_path: str


app = FastAPI()

# #TODO nothing todo just tagging as preserved for now while react migration is in progress
app.mount("/site", StaticFiles(directory="./frontend"), name="site")
app.mount("/static", StaticFiles(directory="./frontend/static"), name="static")

templates = Jinja2Templates(directory="./frontend")
# app.mount("/", StaticFiles(directory="reach-react-app/build", html=True), name="react_app")


manager = WebSocketManager()


# Dynamic directory for outputs once first research is run
@app.on_event("startup")
def startup_event():
    if not os.path.isdir("outputs"):
        os.makedirs("outputs")
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse('index.html', {"request": request, "report": None})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("start"):
                json_data = json.loads(data[6:])
                task = json_data.get("task")
                report_type = json_data.get("report_type")
                sources = json_data.get("sources", [])
                
                if task and report_type:
                    report = await manager.start_streaming(task, report_type, sources, websocket)
                    path = await write_md_to_pdf(report)
                    await websocket.send_json({"type": "path", "output": path})
                else:
                    print("Error: not enough parameters provided.")

    except WebSocketDisconnect:
        await manager.disconnect(websocket)

@app.post("/setEnvironmentVariables")
async def set_environment_variables(credentials: SalesforceCredentials):
    os.environ['SALESFORCE_USERNAME'] = credentials.username
    os.environ['SALESFORCE_CONSUMER_KEY'] = credentials.consumer_key
    os.environ['SALESFORCE_PRIVATE_KEY_PATH'] = credentials.private_key_path
    return {"message": "Environment variables set successfully"}

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), task: str = Form(...)):
    upload_dir = "uploads"
    if not os.path.isdir(upload_dir):
        os.makedirs(upload_dir)

    async def handle_file(file):
        file_location = f"{upload_dir}/{file.filename}"
        with open(file_location, "wb+") as file_object:
            content = await file.read()
            file_object.write(content)
        
        if file.filename.endswith(".mp4"):
            mp3_paths = await mp4_to_mp3(file_location)
            os.remove(file_location)
            file_location = mp3_paths[0]
        
        return file_location

    uploaded_files_info = []
    for file in files:
        file_location = await handle_file(file)
        uploaded_files_info.append({"filename": file.filename, "location": file_location})
        print(f"Uploaded: {file.filename} to {file_location}")

    parsed_contents = []
    for uploaded_file_info in uploaded_files_info:
        parsed_audio = await parse_text_from_audio()
        parsed_documents = await process_unstructured()
        parsed_content = parsed_audio + parsed_documents
        parsed_contents.extend(parsed_content)

    parsed_uploads_path = f"{upload_dir}/parsed_uploads.json"
    if not os.path.exists(parsed_uploads_path):
        async with aiofiles.open(parsed_uploads_path, "w") as new_file:
            await new_file.write("[]")

    async with aiofiles.open(parsed_uploads_path, "r+") as parsed_uploads_file:
        existing_content = await parsed_uploads_file.read()
        existing_data = json.loads(existing_content) if existing_content else []
        existing_data += parsed_contents
        await parsed_uploads_file.seek(0)
        await parsed_uploads_file.write(json.dumps(existing_data))
        await parsed_uploads_file.truncate()

    return {"info": f"Files uploaded successfully", "task": task, "parsed_info": f"Data written to {parsed_uploads_path}"}
