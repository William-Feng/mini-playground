import React, { useState } from "react";
import "./TicTacToe.css";

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const WIN_STATES = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  // There is a winner if all three cells within any winning state is satisfied
  const checkWin = () => {
    for (let state of WIN_STATES) {
      let [cell0, cell1, cell2] = state;
      if (
        board[cell0] &&
        board[cell0] === board[cell1] &&
        board[cell0] === board[cell2]
      ) {
        setWinner(board[cell0]);
        return true;
      }
    }
    return false;
  };

  // Game results in a draw if all the squares are filled up (without a winner)
  const checkDraw = () => {
    for (let cell of board) {
      if (!cell) return false;
    }
    return true;
  };

  // Reset the board, turn and winner if the restart button is selected
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
  };

  // Update the board, check for any winners and swap turns
  const handleClick = (i) => {
    // A cell can be only clicked if it's not occupied and there is no winner
    if (!winner && !board[i]) {
      board[i] = turn === "X" ? "X" : "O";
      setBoard(board);
      if (checkWin()) {
        setWinner(turn);
      } else if (checkDraw()) {
        setWinner("draw");
      } else {
        setTurn(turn === "X" ? "O" : "X");
      }
    }
  };

  return (
    <div className="container" id="tic-tac-toe">
      <div className="board">
        {board.map((value, i) => (
          <div
            className={value || winner ? "cell occupied" : "cell"}
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
