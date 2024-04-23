import React from "react";

import Player from "./Player";

function Tile({ children, player, onClick }) {
  return (
    <button onClick={onClick} className="tile">
      {player && <Player id="copy" />}
    </button>
  );
}

export default Tile;
