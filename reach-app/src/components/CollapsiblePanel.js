import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { FaSearch, FaTable, FaFileAlt, FaInternetExplorer, FaTerminal } from 'react-icons/fa';
function CollapsiblePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'icon' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`collapsible-panel ${isOpen ? 'open' : ''}`}>
      <button onClick={togglePanel}>Toggle Panel</button>
      <input type="text" placeholder="Search..." />
      <div className="icons">
        <FaFileAlt ref={drag} />
        <FaTable ref={drag} />
        <FaInternetExplorer ref={drag} />
        <FaTerminal ref={drag} />
      </div>
    </div>
  );
}
export default CollapsiblePanel;