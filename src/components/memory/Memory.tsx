import { FC, useContext, useEffect, useState } from "react";
import { easyColours, mediumColours, hardColours } from "./MemoryColours";
import { AppContext, AppContextType } from "../../App";
import ModeTab from "../misc/ModeTab";
import { newMinStat } from "../../utils/Stats";
import { Storage } from "../../utils/Storage";
import { STORAGE_KEYS } from "../../constants/storage";
import { Difficulty, MemoryCell } from "../../types/common";
import "./Memory.css";

type Status = "hidden" | "stable" | "";

interface Previous {
  colour: string;
  index: number;
}

const Memory: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const COLOUR_HIDDEN: Status = "hidden";
  const CELL_STABLE: Status = "stable";

  const [difficulty, setDifficulty] = useState<Difficulty>(
    (Storage.getString(STORAGE_KEYS.COLOUR_DIFFICULTY, "easy") as Difficulty)
  );
  const [board, setBoard] = useState<MemoryCell[]>([]);
  const [previous, setPrevious] = useState<Previous | null>(null);
  const [lockBoard, setLockBoard] = useState<boolean>(false);
  const [turns, setTurns] = useState<number>(0);
  const [numMatching, setNumMatching] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    setBoard(gameInitialisation(difficulty));
    Storage.setString(STORAGE_KEYS.COLOUR_DIFFICULTY, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty: string) => {
    if (["easy", "medium", "hard"].includes(newDifficulty)) {
      setDifficulty(newDifficulty as Difficulty);
    }
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = (difficulty: Difficulty): MemoryCell[] => {
    setPrevious(null);
    setLockBoard(false);
    setTurns(0);
    setNumMatching(0);
    setSolved(false);

    let colours: string[];

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
  const shuffleBoard = (colours: string[]) => {
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
  const checkSame = (i: number) => {
    return board[i].status !== COLOUR_HIDDEN;
  };

  // Check if the two selected cells have the same underlying colour
  const checkMatching = (i: number) => {
    return board[i].colour === previous?.colour;
  };

  // Prevent clicking if board is locked or the new cell is already correct
  const allowedClick = (i: number) => {
    return !lockBoard && board[i].status !== CELL_STABLE;
  };

  // Show the colour of the cell if nothing was selected before in this turn
  const firstSelected = (i: number) => {
    const updatedBoard = [...board];
    updatedBoard[i].status = "";
    setBoard(updatedBoard);
    setPrevious({ colour: board[i].colour, index: i });
  };

  // Another cell was previously selected in this turn
  const secondSelected = (i: number) => {
    setTurns(turns + 1);
    const updatedBoard = [...board];
    if (checkSame(i)) {
      // Hide the cell again if it's selected twice
      updatedBoard[i].status = COLOUR_HIDDEN;
      setBoard(updatedBoard);
      setPrevious(null);
    } else if (checkMatching(i)) {
      // Set both cells to be stable if they match
      updatedBoard[previous!.index].status = CELL_STABLE;
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
        resetBoard[previous!.index].status = COLOUR_HIDDEN;
        resetBoard[i].status = COLOUR_HIDDEN;
        setBoard(resetBoard);
        setPrevious(null);
        setLockBoard(false);
      }, 1000);
    }
  };

  // A cell within the board is clicked
  const handleClick = (i: number) => {
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

  // Update the game statistics when the game is over
  useEffect(() => {
    if (!solved) return;

    const statLabel = `Minimum Turns (${
      difficulty === "easy"
        ? "Easy"
        : difficulty === "medium"
        ? "Medium"
        : "Hard"
    })`;

    newMinStat(
      "Colour Matching",
      statLabel,
      difficulty === "easy" ? STORAGE_KEYS.COLOUR_MIN_TURNS_EASY : difficulty === "medium" ? STORAGE_KEYS.COLOUR_MIN_TURNS_MEDIUM : STORAGE_KEYS.COLOUR_MIN_TURNS_HARD,
      turns,
      setGameStat
    );

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
};

export default Memory;
