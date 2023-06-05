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
  const [turns, setTurns] = useState(0);
  const [numMatching, setNumMatching] = useState(0);

  // Reset the board and all variables for a new game or upon restart
  const gameInitialisation = () => {
    setPrevious(null);
    setLockBoard(false);
    setTurns(0);
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
    const updatedBoard = [...board];
    updatedBoard[i].status = "";
    setBoard(updatedBoard);
    setPrevious({ colour: board[i].colour, index: i });
  };

  // Another cell was previously selected in this turn
  const secondSelected = (i) => {
    setTurns(turns + 1);
    const updatedBoard = [...board];
    if (checkSame(i)) {
      // Hide the cell again if it's selected twice
      updatedBoard[i].status = COLOUR_HIDDEN;
      setBoard(updatedBoard);
      setPrevious(null);
    } else if (checkMatching(i)) {
      // Set both cells to be stable if they match
      updatedBoard[previous.index].status = CELL_STABLE;
      updatedBoard[i].status = CELL_STABLE;
      setBoard(updatedBoard);
      setPrevious(null);
      setNumMatching(numMatching + 1);
    } else {
      // Show the colour of the cells for 1 second if they don't match, then reset
      // Prevent user from clicking any cells during this delay
      updatedBoard[i].status = "";
      setBoard(updatedBoard);
      setLockBoard(true);
      setTimeout(() => {
        const resetBoard = [...board];
        resetBoard[previous.index].status = COLOUR_HIDDEN;
        resetBoard[i].status = COLOUR_HIDDEN;
        setBoard(resetBoard);
        setPrevious(null);
        setLockBoard(false);
      }, 1000);
    }
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
      <div className="message">
        {numMatching === WIN_NUM_MATCH && <h2>Well done!</h2>}
        <h3>Turns: {turns}</h3>
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
