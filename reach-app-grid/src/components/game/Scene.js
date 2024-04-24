import React, { useReducer, useState } from "react";

import { Grid, Row } from "./Battleground";
import Tile from "./Tile";

import { reducer, initialState } from "../../state";

import PopupMenu from "./PopupMenu";

import CONSTANTS from "../../utils/constants";

function Scene() {
  const [{ row, col }, dispatch] = useReducer(reducer, initialState);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });


  const handleTileClick = (r, t) => (event) => {
    dispatch({
      type: "MOVE",
      payload: {
        row: r,
        col: t
      }
    });
    setPopupPosition({ x: r, y: t });
    setPopupVisible(true);
  };

  const closePopup = () => setPopupVisible(false);

  return (
    <div className="scene">
      <Grid>
        {Array(CONSTANTS.MAX_ROW)
          .fill("r")
          .map((_, rIndex) => (
            <Row key={rIndex}>
              {Array(CONSTANTS.MAX_COLUMN)
                .fill("t")
                .map((_, tIndex) => (
                  <Tile
                    onClick={handleTileClick(rIndex, tIndex)}
                    key={tIndex}
                    player={rIndex === row && tIndex === col}
                  />
                ))}
            </Row>
          ))}
      </Grid>
      <PopupMenu visible={popupVisible} position={popupPosition} onClose={closePopup} />
    </div>
  );
}

export default Scene;
