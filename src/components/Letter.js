import React, { useContext } from "react";
import { AppContext } from "../App";

function Letter({ attemptNum, letterPos }) {
  const { grid } = useContext(AppContext);
  const letter = grid[attemptNum][letterPos];
  return <div className="letter">{letter}</div>;
}

export default Letter;
