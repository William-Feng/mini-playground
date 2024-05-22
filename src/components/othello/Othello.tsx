import React, { FC, useContext, useState } from "react";
import { AppContext, AppContextType } from "../../App";
import "./Othello.css";

type Player = "light" | "dark";
type Cell = Player | null;

const Othello: FC = () => {
  const { theme } = useContext<AppContextType>(AppContext);

  const SIZE = 8;

  const createInitialBoard = (): Cell[][] => {
    const board: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );
    board[3][3] = "light";
    board[3][4] = "dark";
    board[4][3] = "dark";
    board[4][4] = "light";
    return board;
  };

  const [board, setBoard] = useState<Cell[][]>(createInitialBoard());
  const [turn, setTurn] = useState<Player>("dark");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setTurn("dark");
    setWinner(null);
  };

  const capitalise = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="background othello" id={theme}>
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={"cell " + (value || winner ? "stable" : "")}
              key={`${i}-${j}`}
            >
              {value && <div className={`tile-${value}`}></div>}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {!winner ? (
          <h3>{capitalise(turn)}'s Turn</h3>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>{winner} Wins!</h2>
        )}
        <button className="restart" onClick={() => handleRestart()}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default Othello;
