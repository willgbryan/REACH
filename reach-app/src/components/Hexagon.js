import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import axios from 'axios';
function Hexagon() {
  const [isOver, setIsOver] = useState(false);
  const [{ canDrop }, drop] = useDrop({
    accept: ['file', 'icon'],
    drop: (item, monitor) => {
      if (item.type === 'file') {
        axios.post('/api/files', item)
          .then(res => console.log(res))
          .catch(err => console.error(err));
      }
      setIsOver(false);
    },
    hover: () => setIsOver(true),
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
    }),
  });
  return (
    <div ref={drop} className={`hexagon ${canDrop ? 'can-drop' : ''} ${isOver ? 'is-over' : ''}`}>
      Drop files or icons here
    </div>
  );
}
export default Hexagon;