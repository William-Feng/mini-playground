import React, { useContext, useEffect } from "react";
import { AppContext } from "./Wordle";

function Letter({ attemptNum, letterPos }) {
  const {
    grid,
    secret,
    curr,
    MAX_LETTERS,
    setCorrectLetters,
    setPartialLetters,
    setIncorrectLetters,
  } = useContext(AppContext);
  const letter = grid[attemptNum][letterPos];

  const correct = secret[letterPos] === letter;
  // Need to check the number of occurrences of the letter
  // within the secret word before setting it to yellow
  let partial = false;
  if (!correct && letter !== "" && secret.includes(letter)) {
    const letterCount = secret.match(new RegExp(letter, "g")).length;
    let currCount = 0;
    let forwardCorrect = 0;
    for (let i = 0; i < MAX_LETTERS - 1; i++) {
      if (i < letterPos && grid[attemptNum][i] === letter) {
        currCount++;
      } else if (i > letterPos && grid[attemptNum][i] === secret[i]) {
        forwardCorrect++;
      }
    }
    // Also ensure that the same letter is not correct in a forward position
    if (currCount < letterCount - forwardCorrect) {
      partial = true;
    }
  }

  useEffect(() => {
    if (correct) setCorrectLetters((prev) => [...prev, letter]);
    else if (partial) setPartialLetters((prev) => [...prev, letter]);
    else if (letter !== "") setIncorrectLetters((prev) => [...prev, letter]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curr.attempt]);

  const letterState =
    curr.attempt > attemptNum &&
    (correct ? "correct" : partial ? "partial" : "incorrect");

  return (
    <div
      className="letter"
      id={letterState ? letterState : letter ? "entered" : undefined}
    >
      {letter}
    </div>
  );
}

export default Letter;
