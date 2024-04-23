import React, { useReducer } from "react";

import { Grid, Row } from "./Battleground";
import Tile from "./Tile";

import { reducer, initialState } from "../../state";

import CONSTANTS from "../../utils/constants";

function Scene() {
  const [{ row, col }, dispatch] = useReducer(reducer, initialState);

  const handleTileClick = (r, t) => () => {
    dispatch({
      type: "MOVE",
      payload: {
        row: r,
        col: t
      }
    });
  };

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
    </div>
  );
}

export default Scene;
