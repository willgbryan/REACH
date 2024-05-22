const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const processUploadFiles = async (files: File[], task: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('task', task);

  try {
    const response = await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
      },
    });

    if (!response.ok) {
      throw new Error(`Error uploading files: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading files to backend:', error);
    throw error;
  }
};

export class WebSocketManager {
  websocket: WebSocket | null = null;

  connect(url: string, onMessage: (data: any) => void, onError: (error: any) => void) {
    this.websocket = new WebSocket(url);

    this.websocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.websocket.onerror = (event) => {
      console.error('WebSocket error:', event);
      onError(event);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendMessage(message: string) {
    if (this.websocket) {
      this.websocket.send(message);
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
