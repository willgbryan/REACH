// components/DropzoneHexagonGrid.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import HexagonGrid from './HexagonGrid';
import styled from 'styled-components';

const StyledDropzone = styled.div`
  background: lightblue;
  border: 2px dashed #007bff;
  padding: 20px;
  width: 100%;
  margin-top: 20px;
`;

const DropzoneHexagonGrid = () => {
  const [hexagons, setHexagons] = useState(Array(30).fill({ content: "" }));

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles); // You would handle file logic here
    // Update the state with file type icons or other content
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <StyledDropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      <HexagonGrid hexagons={hexagons} />
    </StyledDropzone>
  );
};

export default DropzoneHexagonGrid;
