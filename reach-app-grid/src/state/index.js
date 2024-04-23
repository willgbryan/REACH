import random from "lodash.random";

import CONSTANTS from "../utils/constants";
import MOCKS from "../utils/constants";

export const initialState = {
  row: random(0, CONSTANTS.MAX_ROW - 1),
  col: random(0, CONSTANTS.MAX_COLUMN - 1),
  currentPlayer: MOCKS.CURRENT_PLAYER
};

export function reducer(state, action) {
  switch (action.type) {
    case "MOVE":
      return { ...state, row: action.payload.row, col: action.payload.col };
    default:
      return state;
  }
}
