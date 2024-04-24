import React, { useState } from 'react';

function PopupMenu({ visible, position, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', 'fileUpload');

      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          onUploadSuccess();
          onClose(); // Close the popup after successful upload
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="popup-menu" style={{ top: position.y, left: position.x }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={onClose}>X</button>
    </div>
  );
}

export default PopupMenu;