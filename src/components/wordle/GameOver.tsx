import { FC, useContext } from "react";
import { WordleContext, WordleContextType } from "./Wordle";

const GameOver: FC = () => {
  const { handleRestart, gameOver, secret, curr } =
    useContext<WordleContextType>(WordleContext);

  return (
    <div className="gameOver">
      <h2 className="answer">
        Answer: <b>{secret}</b>
      </h2>
      {gameOver.guessedWord ? (
        <h3>
          You guessed in {curr.attempt}
          {curr.attempt === 1 ? " attempt" : " attempts"} 🤩
        </h3>
      ) : (
        <h3>Better luck next time 😭</h3>
      )}
      <button className="restart" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
};

export default GameOver;
