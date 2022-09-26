import React, { useContext } from "react";
import { AppContext } from "./Wordle";
import { MdOutlineBackspace } from "react-icons/md";

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
          : correct
          ? "correct-key"
          : partial
          ? "partial-key"
          : incorrect
          ? "incorrect-key"
          : ""
      }
      onClick={updateGrid}
    >
      {val !== "DELETE" ? val : <MdOutlineBackspace className="backspace" />}
    </div>
  );
}

export default Key;
