import React from 'react';

function PopupMenu({ visible, position, onClose }) {
  if (!visible) return null;

  return (
    <div className="popup-menu" style={{ top: position.y, left: position.x }}>
      {/* Popup content here */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default PopupMenu;