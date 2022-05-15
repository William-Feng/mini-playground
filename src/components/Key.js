import React, { useContext } from "react";
import { AppContext } from "../App";

function Key({ val, special, correct, partial, incorrect }) {
  const { onLetter, onEnter, onDelete } = useContext(AppContext);

  const updateGrid = () => {
    if (val === "ENTER") {
      onEnter();
    } else if (val === "DELETE") {
      onDelete();
    } else {
      onLetter(val);
    }
  };

  return (
    <div
      className="key"
      id={
        special
          ? "bigKey"
          : (correct && "correct") ||
            (partial && "partial") ||
            (incorrect && "incorrect")
      }
      onClick={updateGrid}
    >
      {val}
    </div>
  );
}

export default Key;
