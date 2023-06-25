import React, { useContext, useEffect, useState } from "react";
import { easyColours, mediumColours, hardColours } from "./MemoryColours";
import { AppContext } from "../../App";
import ModeTab from "../misc/ModeTab";
import "./Memory.css";

function Memory() {
  const { theme, setGameStat } = useContext(AppContext);

  const COLOUR_HIDDEN = "hidden";
  const CELL_STABLE = "stable";

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem("colour-difficulty") || "easy"
  );
  const [board, setBoard] = useState([]);
  const [previous, setPrevious] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [turns, setTurns] = useState(0);
  const [numMatching, setNumMatching] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setBoard(gameInitialisation(difficulty));
    localStorage.setItem("colour-difficulty", difficulty);
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
    setSolved(false);

    let colours;

    if (difficulty === "easy") {
      colours = easyColours;
    } else if (difficulty === "medium") {
      colours = mediumColours;
    } else {
      colours = hardColours;
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

  useEffect(() => {
    setSolved(board.length > 0 && numMatching === board.length / 2);
  }, [numMatching, board]);

  // Only update the minimum turns in local storage if the game is solved
  useEffect(() => {
    if (solved) {
      const savedMinTurnsKey = `colour-minTurns-${difficulty}`;
      const savedMinTurns = localStorage.getItem(savedMinTurnsKey);
      if (!savedMinTurns || turns < parseInt(savedMinTurns)) {
        localStorage.setItem(savedMinTurnsKey, turns.toString());
      }

      setGameStat((prevStats) => {
        const prevMinTurnsKey = `Minimum Turns (${
          difficulty === "easy"
            ? "Easy"
            : difficulty === "medium"
            ? "Medium"
            : "Hard"
        })`;

        return {
          ...prevStats,
          "Colour Matching": {
            ...prevStats["Colour Matching"],
            [prevMinTurnsKey]: Math.min(savedMinTurns || Infinity, turns),
          },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, setGameStat]);

  return (
    <div
      className={
        "background memory " +
        (difficulty === "medium"
          ? "medium"
          : difficulty === "hard"
          ? "hard"
          : "")
      }
      id={theme}
    >
      <ModeTab
        modeType={difficulty}
        handleModeChange={handleDifficultyChange}
        modes={["easy", "medium", "hard"]}
      />
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
        {solved && <h2>Well Done!</h2>}
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
