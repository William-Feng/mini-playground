import React, { useContext, useEffect, useState } from "react";
import { WordleContext } from "./Wordle";

function GameOver() {
  const { handleRestart, gameOver, secret, curr } = useContext(WordleContext);
  const [showComponent, setShowComponent] = useState(false);

  // Only show this component after all 5 letters in the final attempt have been flipped
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!showComponent) {
    return null;
  }

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
