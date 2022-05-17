import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const { gameOver, secret, curr } = useContext(AppContext);
  return (
    <div>
      <h2>Correct: {secret}</h2>
      {gameOver.guessedWord ? (
        <h3>Well done! You guessed in {curr.attempt} attempts 🤩</h3>
      ) : (
        <h3>Better luck next time 😭</h3>
      )}
    </div>
  );
}

export default GameOver;
