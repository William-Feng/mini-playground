import React, { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import "./Memory.css";

function Memory() {
  const { theme } = useContext(ThemeContext);

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

  const WIN_NUM_MATCH = colours.length / 2;
  const COLOUR_HIDDEN = "hidden";
  const CELL_STABLE = "stable";
  const [previous, setPrevious] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [turn, setTurn] = useState(0);
  const [numMatching, setNumMatching] = useState(0);

  // Reset the board and all variables for a new game or upon restart
  const gameInitialisation = () => {
    setPrevious(null);
    setLockBoard(false);
    setTurn(0);
    setNumMatching(0);
    const board = [];
    for (let i = 0; i < colours.length; i++) {
      let cell = {};
      cell["colour"] = colours[i];
      cell["status"] = COLOUR_HIDDEN;
      board.push(cell);
    }
    return shuffleBoard(board);
  };

  // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
  const shuffleBoard = (board) => {
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
    return board;
  };

  const [board, setBoard] = useState(gameInitialisation);

  // Another cell was selected before in this turn so checks are necessary
  const secondSelected = (i) => {
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
      setLockBoard(true);
      setTimeout(() => {
        previous.status = COLOUR_HIDDEN;
        board[i].status = COLOUR_HIDDEN;
        setBoard(board);
        setPrevious(null);
        setLockBoard(false);
      }, 1000);
    }
  };

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

  // A cell within the board is clicked
  const handleClick = (i) => {
    if (allowedClick(i)) {
      if (!previous) {
        firstSelected(i);
      } else {
        secondSelected(i);
      }
    }
  };

  // Message to be displayed depending on whether user has won
  const message = () => {
    if (numMatching === WIN_NUM_MATCH) {
      return <h2>Well done! Turns used: {turn}</h2>;
    } else {
      return <h2>Turns: {turn}</h2>;
    }
  };

  return (
    <div className="background memory" id={theme}>
      <div className="board">
        {board.map((value, i) => (
          <div
            className={
              "cell " +
              (value.status === COLOUR_HIDDEN ? COLOUR_HIDDEN : value.colour) +
              (value.status === CELL_STABLE ? " " + CELL_STABLE : "")
            }
            key={i}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
      <div>
        {message()}
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

export default Memory;
