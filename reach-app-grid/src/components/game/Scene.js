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
  const [tileColor, setTileColor] = useState({});

  const handleTileClick = (r, t) => (event) => {
    dispatch({
      type: "MOVE",
      payload: {
        row: r,
        col: t
      }
    });
    setPopupPosition({ x: t, y: r });
    setPopupVisible(true);
  };

  const handleUploadSuccess = () => {
    setTileColor({ ...tileColor, [`${row},${col}`]: "#131313" });
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
      <div className="REACH-text-field-3d">&lt;REACH-001&gt;</div>
      <div className="PROVISIONAL-text-field-3d">PROVISONAL</div>
      {/* <PopupMenu visible={popupVisible} position={popupPosition} onClose={closePopup} onUploadSuccess={handleUploadSuccess} />   */}
    </div>
  );
}

export default Scene;
