import React, { useContext, useState } from "react";
import { AppContext } from "../../App";
import "./Minesweeper.css";

function Minesweeper() {
  const { theme } = useContext(AppContext);

  const SIZE = 8;
  const [timer, setTimer] = useState("00:00");
  const [gameStatus, setGameStatus] = useState(false);

  const gameInitialisation = () => {
    setTimer("00:00");
    setGameStatus(false);
    return initialiseBoard();
  };

  const initialiseBoard = () => {
    let board = [...Array(SIZE)].map(() => Array(SIZE).fill(""));
    return board;
  };

  const [board, setBoard] = useState(gameInitialisation);

  return (
    <div className="background minesweeper" id={theme}>
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div className="cell" key={`${i}-${j}`}>
              {value}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {gameStatus === "game-won" && <h2>Well Done!</h2>}
        {gameStatus === "game-over" && <h2>Game Over!</h2>}
        <h3>
          Time Elapsed: <b>{timer}</b>
        </h3>
        <button
          className="restart"
          onClick={() => setBoard(gameInitialisation)}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default Minesweeper;
