let accumulatedData = '';
let cleanedDataGlobal = '';

const Reach = (() => {
    const init = () => {
      // Not sure, but I think it would be better to add event handlers here instead of in the HTML
      //document.getElementById("startResearch").addEventListener("click", startResearch);
      document.getElementById("copyToClipboard").addEventListener("click", copyToClipboard);
      document.getElementById("debugFinishState").addEventListener("click", () => {
        updateState("finished");
      });

      updateState("initial");
    }

    const startResearch = () => {
      document.getElementById("output").innerHTML = "";
      document.getElementById("reportContainer").innerHTML = "";
      updateState("in_progress")
      accumulatedData = '';
  
      addAgentResponse({ output: "Thinking about research questions for the task..." });
  
      listenToSockEvents();
    };
  
    const listenToSockEvents = () => {
      const { protocol, host, pathname } = window.location;
      const ws_uri = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${pathname}ws`;
      const converter = new showdown.Converter();
      const socket = new WebSocket(ws_uri);
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received data of type:", data.type);
        if (data.type === 'logs') {
          addAgentResponse(data);
        } else if (data.type === 'report') {
          accumulatedData += data.output;
          writeReport(data, converter);
        } else if (data.type === 'path') {
          updateState("finished");
          updateDownloadLinkPDF(data);
        } else if (data.type === 'path') {
          updateState("finished");
          updateDownloadLinkCSV(data);
        }
      };
  
      socket.onopen = (event) => {
        const task = document.querySelector('input[name="task"]').value;
        const report_type = document.querySelector('select[name="report_type"]').value;
        const agent = document.querySelector('input[name="agent"]:checked').value;
  
        const requestData = {
          task: task,
          report_type: report_type,
          agent: agent,
        };
  
        socket.send(`start ${JSON.stringify(requestData)}`);
      };
    };
  
    const addAgentResponse = (data) => {
      const output = document.getElementById("output");
      output.innerHTML += '<div class="agent_response">' + data.output + '</div>';
      output.scrollTop = output.scrollHeight;
      output.style.display = "block";
      updateScroll();
    };
  
    // // Preserving in case of breaks
    // const writeReport = (data, converter) => {
    //   const reportContainer = document.getElementById("reportContainer");
    //   const markdownOutput = converter.makeHtml(data.output);
    //   reportContainer.innerHTML += markdownOutput;
    //   updateScroll();
    // };

    const writeReport = (data, converter, status) => {
      const reportContainer = document.getElementById("reportContainer");
      const reportType = document.querySelector('select[name="report_type"]').value; // Get the current report type
    
      console.log("Output type:", typeof data.output, "Value:", data.output);
      if (reportType === 'table') {
        console.log("Rendering as table");
        let cleanedData = accumulatedData.startsWith('```csv') ? accumulatedData.slice(6) : accumulatedData;
        cleanedDataGlobal += cleanedData;
        const htmlTable = convertCSVToHTMLTable(cleanedData);
        reportContainer.innerHTML = htmlTable;
        if (status == 'enabled') {
          reportContainer.innerHTML = cleanedData;
        }
      } else {
        console.log("html");
        const markdownOutput = converter.makeHtml(data.output);
        reportContainer.innerHTML += markdownOutput;
      }
    
      updateScroll();
    };

      const convertCSVToHTMLTable = (csv) => {
        const rows = csv.trim().split('\n');
        let html = '<table class="table table-bordered table-responsive">';

        html += '<thead class="thead-dark"><tr>';
        parseCSVLine(rows[0]).forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead>';

        html += '<tbody>';
        rows.slice(1).forEach(row => {
            html += '<tr>';
            parseCSVLine(row).forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';

        return html;
    };

    const parseCSVLine = (line) => {
      let result = [];
      let startValueIdx = 0;
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
          if (line[i] === '"' && line[i - 1] !== '\\') {
              inQuotes = !inQuotes;
              continue;
          }
          
          if (line[i] === ',' && !inQuotes) {
              result.push(decodeCSVValue(line.substring(startValueIdx, i)));
              startValueIdx = i + 1;
          }
      }
      result.push(decodeCSVValue(line.substring(startValueIdx)));

      return result;
    };

    const decodeCSVValue = (value) => {
      let trimmedValue = value.trim();
      if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
          trimmedValue = trimmedValue.substring(1, trimmedValue.length - 1);
      }
      return trimmedValue.replace(/\\"/g, '"');
    };


    const updateDownloadLinkPDF = (data) => {
      const pdf_path = data.output.pdf;
      const docx_path = data.output.docx
      console.log("Updating PDF download link to:", path);
      document.getElementById("downloadLink").setAttribute("href", pdf_path);
      document.getElementById("downloadLinkWord").setAttribute("href", docx_path);
      // downloadLinkPDF.setAttribute("href", path);
      // downloadLinkPDF.removeAttribute('onclick');
      // downloadLinkPDF.classList.remove("disabled");
    };
    
    // This is broken 
    const updateDownloadLinkCSV = () => {
      console.log("Preparing to download CSV data.");
      // Assuming cleanedDataGlobal contains the CSV data you want to download
      const blob = new Blob([cleanedDataGlobal], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob); // Create a Blob URL for the CSV data
      const downloadLinkCSV = document.getElementById("downloadLinkCSV");
    
      if (!downloadLinkCSV) {
        console.error("Failed to find the download link element for CSV.");
        return;
      }
    
      downloadLinkCSV.setAttribute("href", url); // Set the Blob URL as the href of the download link
      downloadLinkCSV.setAttribute("download", "report.csv"); // Suggest a filename for the downloaded file
      downloadLinkCSV.classList.remove("disabled"); // Make sure the link is clickable
    
      console.log("CSV download link is set up at:", url);
    };
  
    const updateScroll = () => {
      window.scrollTo(0, document.body.scrollHeight);
    };
  
    const copyToClipboard = () => {
      const textarea = document.createElement('textarea');
      textarea.id = 'temp_element';
      textarea.style.height = 0;
      document.body.appendChild(textarea);
      textarea.value = document.getElementById('reportContainer').innerText;
      const selector = document.querySelector('#temp_element');
      selector.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };

    const updateState = (state) => {
      var status = "";
      switch (state) {
        case "in_progress":
          status = "Research in progress..."
          setReportActionsStatus("disabled");
          break;
        case "finished":
          status = "Research finished!"
          setReportActionsStatus("enabled");
          break;
        case "error":
          status = "Research failed!"
          setReportActionsStatus("disabled");
          break;
        case "initial":
          status = ""
          setReportActionsStatus("hidden");
          break;
        default:
          setReportActionsStatus("disabled");
      }
      document.getElementById("status").innerHTML = status;
      console.log("status:", status)
      if (document.getElementById("status").innerHTML == "") {
        document.getElementById("status").style.display = "none";
      } else {
        document.getElementById("status").style.display = "block";
      }
    }

    /**
     * Shows or hides the download and copy buttons
     * @param {str} status Kind of hacky. Takes "enabled", "disabled", or "hidden". "Hidden is same as disabled but also hides the div"
     */
    const setReportActionsStatus = (status) => {
      console.log("Setting report actions status to:", status);
      const reportActions = document.getElementById("reportActions");
      console.log(reportActions); // Should not be null
      console.log(reportActions.querySelectorAll("a")); // Should list the buttons

    
      if (status == "enabled") {
        reportActions.querySelectorAll("a").forEach((link) => {
          console.log("Enabling link:", link.id);
          link.classList.remove("disabled");
          link.removeAttribute('onclick');
          reportActions.style.display = "block";
        });
      } else {
        reportActions.querySelectorAll("a").forEach((link) => {
          console.log("Disabling link:", link.id);
          link.classList.add("disabled");
          link.setAttribute('onclick', "return false;");
        });
        if (status == "hidden") {
          reportActions.style.display = "none";
        }
      }
    }

    // // Debugging
    // const showAndEnableButtons = () => {
    //   console.log("showAndEnableButtons called"); // This should appear in the console
    //   const reportActions = document.getElementById("reportActions");
    //   reportActions.style.display = "block"; // Make sure the container is visible
    //   reportActions.querySelectorAll("a").forEach((link) => {
    //     link.classList.remove("disabled"); // Enable the buttons
    //     link.removeAttribute('onclick'); // Ensure they are clickable
    //   });
    // };
    

    // Ensure the event listener for the download button prevents default behavior
    document.getElementById("downloadLinkCSV").addEventListener("click", function(event) {
      event.preventDefault(); // Prevent the default anchor behavior
      console.log("Download CSV button clicked. Attempting to trigger download.");
      updateDownloadLinkCSV();
    });
    document.addEventListener("DOMContentLoaded", init);
    return {
      startResearch,
      copyToClipboard,
    };
  })();