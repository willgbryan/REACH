import React, { useState, useEffect } from 'react';
import '../styles/MainForm.css'; //TODO

function MainForm() {
  const [task, setTask] = useState('');
  const [reportType, setReportType] = useState('research_report');
  const [file, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const { protocol, host } = window.location;
    const wsUri = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/ws`;
    const ws = new WebSocket(wsUri);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);
    };

    setWebSocket(ws);

    // Clean up on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const startResearch = (e) => {
    e.preventDefault();
    console.log("Starting research for:", task, reportType);

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const requestData = { task, report_type: reportType };
      webSocket.send(`start ${JSON.stringify(requestData)}`);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="container">
      <div className="left-container">
        <form className="mt-3" onSubmit={startResearch}>
          <div className="form-group">
            <h2 className="agent-question">TASK DEFINITION</h2>
            <div className="d-flex align-items-center">
              <input type="text" id="task" name="task" className="form-control"
                required value={task} onChange={e => setTask(e.target.value)} />
              <input type="file" className="btn btn-primary button-padding" onChange={handleFileUpload} />
              <button onClick={handleSubmitFile} className="btn btn-primary">Upload File</button>
            </div>
          </div>
          <div className="form-group d-flex justify-content-between">
            <select name="report_type" className="form-control w-75"
              required value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="research_report">RESEARCH REPORT</option>
              <option value="detailed_report">DEEP REPORT</option>
              <option value="resource_report">RESOURCE REPORT</option>
              <option value="outline_report">OUTLINE REPORT</option>
              <option value="table">TABLE</option>
            </select>
            <input type="submit" value="RESEARCH" className="btn btn-primary button-padding ml-2" />
          </div>
        </form>
      </div>
    </main>
  );
}

export default MainForm;