import React, { useEffect, useState } from "react";
import "./TicTacToe.css";

function TicTacToe() {
  // const boardCells = document.querySelectorAll("[board-cell]");
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

  function newGame() {
    setTurn("X");
    setWinner(null);
    /*
    boardCells.forEach((cell) => {
      console.log("HELLO");
      cell.classList.remove("nought", "cross");
      cell.innerText = "";
      cell.addEventListener("click", handleClick, { once: true });
    });
    */
  }

  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  function handleClick(e) {
    if (!gameOver) {
      // Place a nought or cross on the cell, and include the class
      const cell = e.target;
      const currentClass = xTurn ? "cross" : "nought";
      cell.innerText = xTurn ? "X" : "O";
      cell.classList.add(currentClass);

      // Check for win and draw states, otherwise switch turns
      if (checkWin(currentClass)) {
        setMessage(`Player ${xTurn ? "X" : "O"} wins!`);
        setGameOver(true);
      } else if (checkDraw()) {
        setMessage("Draw!");
      } else {
        setXTurn(!xTurn);
      }
    }
  }

  // If all the indexes within any one of the provided states contain the same class
  function checkWin(currentClass) {
    return WIN_STATES.some((state) => {
      return state.every((index) => {
        return boardCells[index].classList.contains(currentClass);
      });
    });
  }

  // If every cell is filled with either a nought or cross
  function checkDraw() {
    return [...boardCells].every((cell) => {
      return (
        cell.classList.contains("cross") || cell.classList.contains("nought")
      );
    });
  }
*/

  return (
    <div className="container">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
        <div className="cell board-cell"></div>
      </div>
      <div>
        {!winner ? (
          <h2>Player {turn}'s Turn!</h2>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>Player {winner} wins!</h2>
        )}
        <button id="restart" onClick={() => newGame()}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
