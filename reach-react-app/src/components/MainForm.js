import React, { useState, useEffect, useRef } from 'react';
import showdown from 'showdown';
import '../styles/MainForm.css';

function MainForm() {
  const [task, setTask] = useState('');
  const [reportType, setReportType] = useState('research_report');
  const [file, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [output, setOutput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const { protocol, host, pathname } = window.location;
    const ws_Uri = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${pathname}ws`;
    const socket = new WebSocket(ws_Uri);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
      setStatus("Connected to server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setStatus("Disconnected from server");
    };

    setWebSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'path':
        setDownloadLink(data.output);
        setStatus("Report ready for download");
        break;
      case 'report':
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(data.output);
        setOutput(prevOutput => prevOutput + htmlContent);
        break;
      case 'error':
        setStatus("Error: " + data.message);
        break;
      default:
        console.log("Unhandled data type:", data.type);
    }
  };

  const startResearch = (e) => {
    e.preventDefault();
    setOutput('');
    setStatus("Research in progress...");
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const requestData = { task, report_type: reportType };
      webSocket.send(`start ${JSON.stringify(requestData)}`);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmitFile = async () => {
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
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Success:', data);
      setStatus(`File uploaded successfully: ${data.info}`);
    } catch (error) {
      console.error('Upload error:', error);
      setStatus(`Error during file upload: ${error.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      console.log('Text copied to clipboard');
      setStatus('Output copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy:', err);
      setStatus('Failed to copy text to clipboard');
    });
  };

  return (
    <main className="container">
      <div className="left-container">
        <form className="mt-3" onSubmit={startResearch}>
          <div className="form-group">
            <h2 className="agent-question">TASK DEFINITION</h2>
            <div className="checkbox-group ml-3">
              <label className="box">WEB
                <input type="checkbox" name="source" value="WEB" />
                <span className="checkmark"></span>
              </label>
              <label className="box">FILES
                <input type="checkbox" name="source" value="FILES" />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="d-flex align-items-center">
              <input type="text" id="task" name="task" className="form-control"
                required value={task} onChange={e => setTask(e.target.value)} />
              <input type="file" className="btn btn-primary button-padding" onChange={handleFileUpload} />
              <button type="button" onClick={handleSubmitFile} className="btn btn-primary">Upload File</button>
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
        <div dangerouslySetInnerHTML={{ __html: output }} />
        {downloadLink && <a href={downloadLink} download>Download Report</a>}
        <button onClick={copyToClipboard} className="btn btn-secondary mt-3">Copy Output</button>
        <div>Status: {status}</div>
      </div>
    </main>
  );
}

export default MainForm;
