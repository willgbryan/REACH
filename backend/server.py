from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import json
import os
from typing import List
from reach_core.utils.websocket_manager import WebSocketManager
from reach_core.utils.unstructured_functions import *
from .utils import write_md_to_pdf


class ResearchRequest(BaseModel):
    task: str
    report_type: str
    agent: str
    sources: List[str] = []


app = FastAPI()

# #TODO nothing todo just tagging as preserved for now while react migration is in progress
# app.mount("/site", StaticFiles(directory="./frontend"), name="site")
# app.mount("/static", StaticFiles(directory="./frontend/static"), name="static")

# templates = Jinja2Templates(directory="./frontend")
app.mount("/", StaticFiles(directory="reach-app/build", html=True), name="react_app")


manager = WebSocketManager()


# Dynamic directory for outputs once first research is run
@app.on_event("startup")
def startup_event():
    if not os.path.isdir("outputs"):
        os.makedirs("outputs")
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# @app.get("/")
# async def read_root(request: Request):
#     return templates.TemplateResponse('index.html', {"request": request, "report": None})

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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), task: str = Form(...)):
    upload_dir = "uploads"
    if not os.path.isdir(upload_dir):
        os.makedirs(upload_dir)
    
    file_location = f"{upload_dir}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    
    # TODO experiment with migrating unstructured functions processing to happen on upload here
    # compress on upload here??
    
    return {"info": f"File '{file.filename}' uploaded successfully", "task": task}
