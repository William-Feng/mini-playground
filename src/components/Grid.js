import React, { useState } from "react";
import Letter from "./Letter";

function Grid() {
  const gridDefault = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  const [grid, setGrid] = useState(gridDefault);

  return (
    <div className="grid">
      <div className="row">
        <Letter attemptNum={0} letterPos={0} />
        <Letter attemptNum={0} letterPos={1} />
        <Letter attemptNum={0} letterPos={2} />
        <Letter attemptNum={0} letterPos={3} />
        <Letter attemptNum={0} letterPos={4} />
      </div>
      <div className="row">
        <Letter attemptNum={1} letterPos={0} />
        <Letter attemptNum={1} letterPos={1} />
        <Letter attemptNum={1} letterPos={2} />
        <Letter attemptNum={1} letterPos={3} />
        <Letter attemptNum={1} letterPos={4} />
      </div>
      <div className="row">
        <Letter attemptNum={2} letterPos={0} />
        <Letter attemptNum={2} letterPos={1} />
        <Letter attemptNum={2} letterPos={2} />
        <Letter attemptNum={2} letterPos={3} />
        <Letter attemptNum={2} letterPos={4} />
      </div>
      <div className="row">
        <Letter attemptNum={3} letterPos={0} />
        <Letter attemptNum={3} letterPos={1} />
        <Letter attemptNum={3} letterPos={2} />
        <Letter attemptNum={3} letterPos={3} />
        <Letter attemptNum={3} letterPos={4} />
      </div>
      <div className="row">
        <Letter attemptNum={4} letterPos={0} />
        <Letter attemptNum={4} letterPos={1} />
        <Letter attemptNum={4} letterPos={2} />
        <Letter attemptNum={4} letterPos={3} />
        <Letter attemptNum={4} letterPos={4} />
      </div>
      <div className="row">
        <Letter attemptNum={5} letterPos={0} />
        <Letter attemptNum={5} letterPos={1} />
        <Letter attemptNum={5} letterPos={2} />
        <Letter attemptNum={5} letterPos={3} />
        <Letter attemptNum={5} letterPos={4} />
      </div>
    </div>
  );
}

export default Grid;
