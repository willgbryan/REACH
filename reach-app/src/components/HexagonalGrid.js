import React from 'react';
import Hexagon from './Hexagon';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
function HexagonalGrid() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="hexagonal-grid">
        <Hexagon />
        <Hexagon />
        <Hexagon />
      </div>
    </DndProvider>
  );
}
export default HexagonalGrid;