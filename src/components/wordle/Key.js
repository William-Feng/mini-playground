import React, { useContext } from "react";
import { AppContext } from "./Wordle";

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
          ? "big-key"
          : (correct && "correct-key") ||
            (partial && "partial-key") ||
            (incorrect && "incorrect-key")
      }
      onClick={updateGrid}
    >
      {val}
    </div>
  );
}

export default Key;
