import React, { useEffect, useState } from "react";
import "./TicTacToe.css";

function TicTacToe() {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const WIN_STATES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleRestart = () => {
    setCells(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
  };

  const handleClick = (i) => {
    if (!winner && !cells[i]) {
      cells[i] = turn === "X" ? "X" : "O";
      setCells(cells);
      setTurn(turn === "X" ? "O" : "X");
      /*
      if (checkWin()) {
        setWinner(turn)
      } else if (checkDraw()) {
        setWinner("draw")
      } else {
        setTurn(turn === "X" ? "O" : "X");
      }
      */
    }
  };

  return (
    <div className="container">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        {cells.map((value, i) => (
          <div
            className={value ? "cell occupied" : "cell"}
            key={i}
            onClick={() => handleClick(i)}
          >
            {value}
          </div>
        ))}
      </div>
      <div>
        {!winner ? (
          <h2>Player {turn}'s Turn</h2>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>Player {winner} wins!</h2>
        )}
        <button className="restart" onClick={() => handleRestart()}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
