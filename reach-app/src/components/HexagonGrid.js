// components/HexagonGrid.js
import React from 'react';
import Hexagon from './Hexagon';
import styled from 'styled-components';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const HexagonGrid = ({ hexagons }) => {
  return (
    <Grid>
      {hexagons.map((hex, index) => (
        <Hexagon key={index}>{hex.content}</Hexagon>
      ))}
    </Grid>
  );
};

export default HexagonGrid;
