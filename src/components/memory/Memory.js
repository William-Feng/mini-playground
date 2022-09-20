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
  const WIN_NUM_MATCH = colours.length / 2;
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
  */

  // Another cell was selected before in this turn so we need to check
  function secondSelected(i) {
    setTurn(turn + 1);
    if (checkSame(i)) {
      board[i].status = COLOUR_HIDDEN;
      setBoard(board);
      setPrevious(null);
    } else if (checkMatching(i)) {
      previous.status = CELL_STABLE;
      board[i].status = CELL_STABLE;
      setBoard(board);
      setPrevious(null);
      setNumMatching(numMatching + 1);
    } else {
      // Show the colour of the cell for 1 second, then reset
      // Prevent user from selecting cells during this delay
      board[i].status = "";
      setBoard(board);
      setLockBoard(true);
      setTimeout(() => {
        previous.status = COLOUR_HIDDEN;
        board[i].status = COLOUR_HIDDEN;
        setBoard(board);
        setPrevious(null);
        setLockBoard(false);
      }, 1000);
    }
  }

  // Check if the exact same cell is selected twice
  const checkSame = (i) => {
    return board[i].status !== COLOUR_HIDDEN;
  };

  // Check if the two selected cells have the same underlying colour
  const checkMatching = (i) => {
    return board[i].colour === previous.colour;
  };

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
        secondSelected(i);
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
