import React from "react";
import Key from "./Key";

function Keyboard() {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <div className="keyboard">
      <div className="row">
        {row1.map((key) => {
          return <Key val={key} />;
        })}
      </div>
      <div className="row">
        {row2.map((key) => {
          return <Key val={key} />;
        })}
      </div>
      <div className="row">
        <Key val={"Enter"} special />
        {row3.map((key) => {
          return <Key val={key} />;
        })}
        <Key val={"Delete"} special />
      </div>
    </div>
  );
}

export default Keyboard;
