import React, { useState } from "react";
import "./Memory.css";

function Memory() {
  const colours = [
    "red",
    "red",
    "maroon",
    "maroon",
    "gold",
    "gold",
    "green",
    "green",
    "turquoise",
    "turquoise",
    "blue",
    "blue",
    "violet",
    "violet",
    "purple",
    "purple",
  ];

  const cells = [];
  const WIN_NUM_MATCH = colours.length;
  const COLOUR_HIDDEN = "hidden";
  const CELL_STABLE = "stable";

  for (let i = 0; i < colours.length; i++) {
    let cell = {};
    cell["colour"] = colours[i];
    cell["status"] = COLOUR_HIDDEN;
    cells.push(cell);
  }

  const [board, setBoard] = useState(cells);
  const [previous, setPrevious] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [turn, setTurn] = useState(0);
  const [numMatching, setNumMatching] = useState(0);

  /*
  // Shuffle all the cells so the order is randomised
  function shuffle() {
    boardCells.forEach((cell) => {
      let position = Math.floor(Math.random() * boardCells.length);
      cell.style.order = position;
    });
  }

  // Another cell was selected before in this turn so we need to check
  function secondSelected(cell) {
    numTurns++;
    turnMessage.innerText = "Turns: " + numTurns;
    if (previous == cell) {
      // If the user selects the same cell twice
      cell.classList.add(COLOUR_HIDDEN);
      previous = null;
    } else if (checkMatch(cell)) {
      // Do not allow the cells to be chosen again
      previous.classList.add(CELL_STABLE);
      cell.classList.add(CELL_STABLE);
      previous = null;
      numMatching++;
      checkWin();
    } else {
      // Show the colour of the cell for 1 second, then reset
      // Present user from selecting cells during this delay
      cell.classList.remove(COLOUR_HIDDEN);
      lockBoard = true;
      setTimeout(() => {
        previous.classList.add(COLOUR_HIDDEN);
        cell.classList.add(COLOUR_HIDDEN);
        previous = null;
        lockBoard = false;
      }, 1000);
    }
  }

  // Check if the two selected cells have the same underlying colour
  function checkMatch(cell) {
    cell.classList.remove(COLOUR_HIDDEN);
    return (
      getComputedStyle(previous).backgroundColor ===
      getComputedStyle(cell).backgroundColor
    );
  }
  */

  // Prevent clicking if board is locked or the new cell is already correct
  const allowedClick = (i) => {
    return !lockBoard && board[i].status !== CELL_STABLE;
  };

  // Show the colour of the cell if nothing was selected before in this turn
  const firstSelected = (i) => {
    board[i].status = "";
    setBoard(board);
    setPrevious(board[i]);
  };

  const handleClick = (i) => {
    if (allowedClick(i)) {
      if (!previous) {
        firstSelected(i);
      } else {
        console.log("This is the second cell selected within a pair");
      }
    }
  };

  const message = () => {
    if (numMatching === WIN_NUM_MATCH) {
      if (turn <= 20) {
        return <h2>Well done! Turns used: {turn}</h2>;
      } else {
        return <h2>You won! Turns used: {turn}</h2>;
      }
    } else {
      return <h2>Turns used: {turn}</h2>;
    }
  };

  return (
    <div className="container" id="memory">
      <div className="board">
        {board.map((value, i) => (
          <div
            className={
              "cell " +
              (value.status === COLOUR_HIDDEN ? COLOUR_HIDDEN : value.colour)
            }
            key={i}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <div>
        {message()}
        <button className="restart">Restart</button>
      </div>
    </div>
  );
}

export default Memory;
