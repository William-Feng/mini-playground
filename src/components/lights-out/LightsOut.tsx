import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { AppContext, AppContextType } from "../../App";
import ModeTab from "../misc/ModeTab";
import { newMinStat } from "../../utils/Stats";
import "./LightsOut.css";

type Difficulty = "easy" | "medium" | "hard";

const LightsOut: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const [difficulty, setDifficulty] = useState(
    (localStorage.getItem("lights-difficulty") as Difficulty) || "easy"
  );

  const [board, setBoard] = useState<boolean[][]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  const size = useMemo(
    () => (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 9),
    [difficulty]
  );

  // After the difficulty is set, load any saved state from local storage and initialise the game
  useEffect(() => {
    const savedBoard = localStorage.getItem("lights-board");
    const savedTurns = localStorage.getItem("lights-currentTurns");
    const savedSolved = localStorage.getItem("lights-solved");

    if (
      savedBoard &&
      savedTurns &&
      savedSolved &&
      JSON.parse(savedBoard).length === size
    ) {
      setBoard(JSON.parse(savedBoard));
      setTurns(parseInt(savedTurns));
      setSolved(savedSolved === "true");
    } else {
      gameInitialisation();
    }

    localStorage.setItem("lights-difficulty", difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty: string) => {
    if (["easy", "medium", "hard"].includes(newDifficulty)) {
      setDifficulty(newDifficulty as Difficulty);
    }
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = () => {
    setTurns(0);
    setSolved(false);
    setBoard(Array.from({ length: size }, () => Array(size).fill(false)));
  };

  // Save the state of the game to local storage
  useEffect(() => {
    localStorage.setItem("lights-board", JSON.stringify(board));
    localStorage.setItem("lights-currentTurns", turns.toString());
    localStorage.setItem("lights-solved", solved.toString());
  }, [board, turns, solved]);

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
      "Lights Out",
      statLabel,
      `lights-minTurns-${difficulty}`,
      turns,
      setGameStat
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, setGameStat]);

  return (
    <div
      className={
        "background lights-out " +
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
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={"cell " + (value ? "on" : "off")}
              key={`${i}-${j}`}
            ></div>
          ))
        )}
      </div>
      <div className="message">
        {solved && <h2>Well Done!</h2>}
        <h3>Turns: {turns}</h3>
        <button className="restart" onClick={gameInitialisation}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default LightsOut;
