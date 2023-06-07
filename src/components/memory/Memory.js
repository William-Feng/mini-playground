import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../App";
import DifficultyTab from "../misc/DifficultyTab";
import "./Memory.css";

function Memory() {
  const { theme } = useContext(ThemeContext);

  const COLOUR_HIDDEN = "hidden";
  const CELL_STABLE = "stable";
  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState([]);
  const [previous, setPrevious] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [turns, setTurns] = useState(0);
  const [numMatching, setNumMatching] = useState(0);

  useEffect(() => {
    setBoard(gameInitialisation(difficulty));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = (difficulty) => {
    setPrevious(null);
    setLockBoard(false);
    setTurns(0);
    setNumMatching(0);

    let colours;

    if (difficulty === "easy") {
      colours = [
        "orangered",
        "orangered",
        "saddlebrown",
        "saddlebrown",
        "gold",
        "gold",
        "forestgreen",
        "forestgreen",
        "turquoise",
        "turquoise",
        "royalblue",
        "royalblue",
        "violet",
        "violet",
        "purple",
        "purple",
      ];
    } else {
      colours = [
        "orangered",
        "orangered",
        "saddlebrown",
        "saddlebrown",
        "darkorange",
        "darkorange",
        "burlywood",
        "burlywood",
        "gold",
        "gold",
        "darkgoldenrod",
        "darkgoldenrod",
        "limegreen",
        "limegreen",
        "darkolivegreen",
        "darkolivegreen",
        "mediumspringgreen",
        "mediumspringgreen",
        "teal",
        "teal",
        "royalblue",
        "royalblue",
        "deepskyblue",
        "deepskyblue",
        "aqua",
        "aqua",
        "blueviolet",
        "blueviolet",
        "purple",
        "purple",
        "mediumpurple",
        "mediumpurple",
        "violet",
        "violet",
        "deeppink",
        "deeppink",
      ];
    }

    const shuffledBoard = shuffleBoard(colours);
    return shuffledBoard.map((colour) => ({
      colour,
      status: COLOUR_HIDDEN,
    }));
  };

  // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
  const shuffleBoard = (colours) => {
    const shuffledBoard = [...colours];
    for (let i = shuffledBoard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledBoard[i], shuffledBoard[j]] = [
        shuffledBoard[j],
        shuffledBoard[i],
      ];
    }
    return shuffledBoard;
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
      <DifficultyTab
        difficulty={difficulty}
        handleDifficultyChange={handleDifficultyChange}
      />
      <div className={"board " + (difficulty === "hard" ? "hard" : "")}>
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
        {numMatching === board.length / 2 && <h2>Well done!</h2>}
        <h3>Turns: {turns}</h3>
        <button
          className="restart"
          onClick={() => setBoard(gameInitialisation(difficulty))}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default Memory;
