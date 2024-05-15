import React, { FC, useContext } from "react";
import { WordleContext } from "./Wordle";
import { MdOutlineBackspace } from "react-icons/md";

type KeyProps = {
  val: string;
  enter?: boolean;
  backspace?: boolean;
  correct?: boolean;
  partial?: boolean;
  incorrect?: boolean;
};

const Key: FC<KeyProps> = ({
  val,
  enter,
  backspace,
  correct,
  partial,
  incorrect,
}) => {
  const { onLetter, onEnter, onDelete } = useContext(WordleContext);

  const updateGrid = () => {
    if (val === "ENTER") {
      onEnter();
    } else if (val === "BACKSPACE") {
      onDelete();
    } else {
      onLetter(val);
    }
  };

  return (
    <div
      className="key"
      id={
        enter
          ? "enter-key"
          : backspace
          ? "backspace-key"
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
      {val !== "BACKSPACE" ? val : <MdOutlineBackspace className="backspace" />}
    </div>
  );
};

export default Key;
