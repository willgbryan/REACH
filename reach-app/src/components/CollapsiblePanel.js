import React from 'react';
import { useDrag } from 'react-dnd';
import { FaSearch, FaTable, FaFileAlt, FaInternetExplorer, FaTerminal } from 'react-icons/fa';

function DraggableIcon({ Icon, type }) {
  const [, drag] = useDrag(() => ({
    type: type, // Unique type for each icon
    item: { id: type },
  }));

  // Render different items based on type
  const content = type === 'icon' ? <FaFileAlt /> : 'File';

  return <div ref={drag} className="draggable-item">{content}</div>;
}

function CollapsiblePanel() {
  return (
    <div className="collapsible-panel">
      <DraggableIcon Icon={FaFileAlt} type="file" />
      <DraggableIcon Icon={FaTable} type="table" />
      <DraggableIcon Icon={FaInternetExplorer} type="internet" />
      <DraggableIcon Icon={FaTerminal} type="terminal" />
      {/* Add more icons as needed */}
    </div>
  );
}

export default CollapsiblePanel;