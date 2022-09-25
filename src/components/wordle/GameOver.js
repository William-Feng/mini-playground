import React, { useContext } from "react";
import { AppContext } from "./Wordle";

function GameOver() {
  const { handleRestart, gameOver, secret, curr } = useContext(AppContext);
  return (
    <div className="gameOver">
      <h2 className="answer">Answer: {secret}</h2>
      {gameOver.guessedWord ? (
        <h4>Well done! You guessed in {curr.attempt} attempts 🤩</h4>
      ) : (
        <h4>Better luck next time 😭</h4>
      )}
      <button className="restart" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}

export default GameOver;
