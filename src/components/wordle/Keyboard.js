import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "./Wordle";
import Key from "./Key";

function Keyboard() {
  const {
    onLetter,
    onEnter,
    onDelete,
    curr,
    correctLetters,
    partialLetters,
    incorrectLetters,
  } = useContext(AppContext);

  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const handleKeyboard = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onEnter();
      } else if (e.key === "Backspace") {
        onDelete();
      } else {
        const letters = [...row1, ...row2, ...row3];
        letters.forEach((key) => {
          if (e.key.toUpperCase() === key) {
            onLetter(key);
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [curr]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleKeyboard]);

  return (
    <div className="keyboard" onKeyDown={handleKeyboard}>
      <div className="row">
        {row1.map((key) => {
          return (
            <Key
              val={key}
              correct={correctLetters.includes(key)}
              partial={partialLetters.includes(key)}
              incorrect={incorrectLetters.includes(key)}
            />
          );
        })}
      </div>
      <div className="row">
        {row2.map((key) => {
          return (
            <Key
              val={key}
              correct={correctLetters.includes(key)}
              partial={partialLetters.includes(key)}
              incorrect={incorrectLetters.includes(key)}
            />
          );
        })}
      </div>
      <div className="row">
        <Key val={"ENTER"} special />
        {row3.map((key) => {
          return (
            <Key
              val={key}
              correct={correctLetters.includes(key)}
              partial={partialLetters.includes(key)}
              incorrect={incorrectLetters.includes(key)}
            />
          );
        })}
        <Key val={"DELETE"} special />
      </div>
    </div>
  );
}

export default Keyboard;
