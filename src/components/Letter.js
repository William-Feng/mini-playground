import React, { useContext } from "react";
import { AppContext } from "../App";

function Letter({ attemptNum, letterPos }) {
  const { grid, secret, curr } = useContext(AppContext);
  const letter = grid[attemptNum][letterPos];

  const correct = secret[letterPos] === letter;
  // Need to check the number of occurrences of the letter
  // within the secret word before setting it to yellow
  let partial = 0;
  if (!correct && letter !== "" && secret.includes(letter)) {
    const letterCount = secret.match(new RegExp(letter, "g")).length;
    let currCount = 0;
    for (let i = 0; i < letterPos; i++) {
      if (grid[attemptNum][i] === letter) {
        currCount++;
      }
    }
    if (currCount < letterCount) {
      partial = 1;
    }
  }

  const letterState =
    curr.attempt > attemptNum &&
    (correct ? "correct" : partial ? "partial" : "incorrect");
  return (
    <div className="letter" id={letterState ? letterState : undefined}>
      {letter}
    </div>
  );
}

export default Letter;
