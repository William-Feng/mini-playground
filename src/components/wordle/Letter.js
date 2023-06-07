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
  if (!correct && letter && secret.includes(letter)) {
    const letterCount = secret.split(letter).length - 1;
    const currCount = grid[attemptNum]
      .slice(0, letterPos)
      .filter((char) => char === letter).length;
    const forwardCorrect = grid[attemptNum]
      .slice(letterPos + 1)
      .filter((char) => char === letter).length;

    partial = currCount < letterCount - forwardCorrect;
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
