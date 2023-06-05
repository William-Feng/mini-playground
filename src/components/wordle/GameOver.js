import React, { useContext } from "react";
import { AppContext } from "./Wordle";

function GameOver() {
  const { handleRestart, gameOver, secret, curr } = useContext(AppContext);
  return (
    <div className="gameOver">
      <h2 className="answer">
        Answer: <b>{secret}</b>
      </h2>
      {gameOver.guessedWord ? (
        <h3>
          You guessed in {curr.attempt}{" "}
          {curr.attempt === 1 ? "attempt" : "attempts"} 🤩
        </h3>
      ) : (
        <h3>Better luck next time 😭</h3>
      )}
      <button className="restart" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}

export default GameOver;
