import React from "react";

function Player({ id }) {
  return (
    <div className="player" id={id}>
      <div className="side front" />
      <div className="side back" />
      <div className="side right" />
      <div className="side left" />
      <div className="side top" />
      <div className="side bottom" />
    </div>
  );
}

export default Player;
