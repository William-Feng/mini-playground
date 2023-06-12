import React, { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import "./TicTacToe.css";

function TicTacToe() {
  const { theme } = useContext(ThemeContext);

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

  // Check if a given combination of cells is a winning combination
  const isWinningCombination = (combination) => {
    const [cell0, cell1, cell2] = combination;
    return (
      board[cell0] &&
      board[cell0] === board[cell1] &&
      board[cell0] === board[cell2]
    );
  };

  // If there is a winner, return the winning combination
  const getWinner = () => {
    for (let combination of WIN_STATES) {
      if (isWinningCombination(combination)) {
        return combination;
      }
    }
    return null;
  };

  // Check if a cell index is part of the winning combination
  const isWinningCell = (index) => {
    const winningCombination = getWinner();
    return winningCombination && winningCombination.includes(index);
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
    // A cell can be only clicked if it's not occupied and there's no winner
    if (!winner && !board[i]) {
      board[i] = turn === "X" ? "X" : "O";
      setBoard([...board]);
      const winningCombination = getWinner();
      if (winningCombination) {
        setWinner(board[winningCombination[0]]);
      } else if (checkDraw()) {
        setWinner("draw");
      } else {
        setTurn(turn === "X" ? "O" : "X");
      }
    }
  };

  return (
    <div className="background tic-tac-toe" id={theme}>
      <div className="board">
        {board.map((value, i) => (
          <div
            className={`cell ${value || winner ? "stable" : ""} ${
              isWinningCell(i) ? "winning" : ""
            }`}
            key={i}
            onClick={() => handleClick(i)}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="message">
        {!winner ? (
          <h3>Player {turn}'s Turn</h3>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>Player {winner} Wins!</h2>
        )}
        <button className="restart" onClick={() => handleRestart()}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
