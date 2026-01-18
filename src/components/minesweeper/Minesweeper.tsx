import { FC, useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../App";
import ModeTab from "../misc/ModeTab";
import { incrementStat, newMinTime } from "../../utils/Stats";
import { Storage } from "../../utils/Storage";
import { STORAGE_KEYS } from "../../constants/storage";
import { Difficulty, StringBoard, NumberBoard, BoardPosition } from "../../types/common";
import "./Minesweeper.css";

const Minesweeper: FC = () => {
  const { theme, setGameStat } = useContext(AppContext);

  const [difficulty, setDifficulty] = useState(
    (Storage.getString(STORAGE_KEYS.MINESWEEPER_DIFFICULTY) as Difficulty) || "easy"
  );
  const size = useMemo<number>(
    () => (difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 16),
    [difficulty]
  );
  const numMines = useMemo<number>(
    () => (difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 40),
    [difficulty]
  );

  const [board, setBoard] = useState<StringBoard>([]);
  const [solution, setSolution] = useState<NumberBoard>([]);
  const [revealedCells, setRevealedCells] = useState<BoardPosition[]>([]);
  const [gameStatus, setGameStatus] = useState<{
    inProgress: boolean;
    gameOver: boolean;
    solutionInitialised: boolean;
  }>({
    inProgress: true,
    gameOver: false,
    solutionInitialised: false,
  });
  const [numFlags, setNumFlags] = useState<number>(0);
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("00:00");

  useEffect(() => {
    gameInitialisation();
    Storage.setString(STORAGE_KEYS.MINESWEEPER_DIFFICULTY, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty: string) => {
    if (["easy", "medium", "hard"].includes(newDifficulty)) {
      setDifficulty(newDifficulty as Difficulty);
    }
  };

  const gameInitialisation = () => {
    setBoard([...Array(size)].map(() => Array(size).fill("")));
    setRevealedCells([]);
    setGameStatus({
      inProgress: true,
      gameOver: false,
      solutionInitialised: false,
    });
    setNumFlags(numMines);
    setFlagMode(false);
    setTimer("00:00");
  };

  const initialiseSolution = (i: number, j: number) => {
    let solution = [...Array(size)].map(() => Array(size).fill(0));
    let mines = 0;
    while (mines < numMines) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      // Prevent mine being at the same position as the first click
      if (solution[row][col] === 0 && !(row === i && col === j)) {
        solution[row][col] = 1;
        mines++;
      }
    }
    setGameStatus({ ...gameStatus, solutionInitialised: true });
    return solution;
  };

  const revealLogic = (row: number, col: number, visited: boolean[][]) => {
    if (row < 0 || row >= size || col < 0 || col >= size) return;

    visited[row][col] = true;
    if (board[row][col] === "🚩") {
      board[row][col] = "";
      setNumFlags((flags) => flags + 1);
    }

    let adjacentMines = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < size && j >= 0 && j < size) {
          if (solution[i][j] === 1) {
            adjacentMines++;
          }
        }
      }
    }

    // Recursively reveal cells if there are no neighbouring mines
    if (adjacentMines === 0) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < size && j >= 0 && j < size && !visited[i][j]) {
            revealLogic(i, j, visited);
          }
        }
      }
    } else {
      board[row][col] = adjacentMines.toString();
    }
    setBoard([...board]);
    if (!revealedCells.some((cell) => cell.row === row && cell.col === col)) {
      setRevealedCells((prev) => [...prev, { row, col }]);
    }
  };

  const handleGameOver = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (solution[i][j] === 1) {
          board[i][j] = "💣";
        }
      }
    }
    setBoard([...board]);
    setGameStatus({ ...gameStatus, inProgress: false, gameOver: true });
  };

  const handleClick = (i: number, j: number) => {
    if (!gameStatus.inProgress) return;
    if (board[i][j] === "🚩") return;
    if (flagMode) {
      return handleFlag(null, i, j);
    }
    if (!gameStatus.solutionInitialised) {
      setRevealedCells([{ row: i, col: j }]);
      setSolution(initialiseSolution(i, j));
      return;
    }
    if (solution[i][j] === 1) {
      return handleGameOver();
    }

    const visited = [...Array(size)].map(() => Array(size).fill(false));
    revealLogic(i, j, visited);
  };

  const handleFlag = (
    e: React.MouseEvent<HTMLDivElement> | null,
    i: number,
    j: number
  ) => {
    if (e) e.preventDefault();
    if (!gameStatus.inProgress) return;
    if (revealedCells.some((cell) => cell.row === i && cell.col === j)) {
      return;
    } else if (board[i][j] === "") {
      board[i][j] = "🚩";
      setNumFlags((flags) => flags - 1);
    } else if (board[i][j] === "🚩") {
      board[i][j] = "";
      setNumFlags((flags) => flags + 1);
    }
    setBoard([...board]);
  };

  const handleFlagModeToggle = () => {
    if (!gameStatus.inProgress) return;
    setFlagMode((prev) => !prev);
  };

  useEffect(() => {
    if (revealedCells.length === size * size - numMines) {
      setGameStatus({ ...gameStatus, inProgress: false, gameOver: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedCells]);

  useEffect(() => {
    if (solution.length > 0 && revealedCells.length > 0) {
      const visited = [...Array(size)].map(() => Array(size).fill(false));
      revealLogic(revealedCells[0].row, revealedCells[0].col, visited);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution]);

  useEffect(() => {
    let startTime: number | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const updateTimer = () => {
      let currentTime = new Date().getTime();
      if (!startTime) return;
      let elapsedTime = Math.floor((currentTime - startTime) / 1000);
      let minutes = Math.floor(elapsedTime / 60);
      let seconds = elapsedTime % 60;

      if (minutes > 59) {
        minutes = 59;
        seconds = 59;
      }

      let minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      let secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      setTimer(`${minutesStr}:${secondsStr}`);
    };

    // Update the timer every second only if the user has selected the first cell
    if (gameStatus.solutionInitialised && gameStatus.inProgress) {
      startTime = new Date().getTime();
      intervalId = setInterval(updateTimer, 1000);
    }

    // Keep the timer value upon game won/lost, and only reset it upon pressing Restart
    return () => {
      if (gameStatus.inProgress && intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStatus]);

  const cellClass = (i: number, j: number, value: string | number) => {
    let classes = "cell";
    if (revealedCells.some((cell) => cell.row === i && cell.col === j)) {
      classes += " revealed";
      const parsedValue = parseInt(value.toString());
      if (!isNaN(parsedValue)) {
        if (parsedValue === 1) {
          classes += " one";
        } else if (parsedValue === 2) {
          classes += " two";
        } else if (parsedValue === 3) {
          classes += " three";
        } else if (parsedValue === 4) {
          classes += " four";
        } else if (parsedValue === 5) {
          classes += " five";
        } else if (parsedValue === 6) {
          classes += " six";
        } else if (parsedValue === 7) {
          classes += " seven";
        } else if (parsedValue === 8) {
          classes += " eight";
        }
      }
    }
    if (!gameStatus.inProgress) {
      classes += " stable";
    }
    return classes;
  };

  // Update the game statistics when the game is complete
  useEffect(() => {
    if (!gameStatus.inProgress) {
      if (gameStatus.gameOver) {
        incrementStat(
          "Minesweeper",
          "Games Lost",
          STORAGE_KEYS.MINESWEEPER_LOST,
          setGameStat
        );
      } else {
        incrementStat(
          "Minesweeper",
          "Games Won",
          STORAGE_KEYS.MINESWEEPER_WON,
          setGameStat
        );

        const prevMinTimeKey = `Minimum Time (${
          difficulty === "easy"
            ? "Easy"
            : difficulty === "medium"
            ? "Medium"
            : "Hard"
        })`;

        newMinTime(
          "Minesweeper",
          prevMinTimeKey,
          difficulty === "easy" ? STORAGE_KEYS.MINESWEEPER_MIN_TIME_EASY : difficulty === "medium" ? STORAGE_KEYS.MINESWEEPER_MIN_TIME_MEDIUM : STORAGE_KEYS.MINESWEEPER_MIN_TIME_HARD,
          timer,
          setGameStat
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, setGameStat]);

  return (
    <div
      className={
        "background minesweeper " +
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
              className={cellClass(i, j, value)}
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              onContextMenu={(e) => handleFlag(e, i, j)}
            >
              {value}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {!gameStatus.inProgress && (
          <h2>{gameStatus.gameOver ? "Game Over!" : "Well Done!"}</h2>
        )}
        <div className="stats">
          <h3
            className={`flag ${flagMode ? "flag-mode-active" : ""} ${
              !gameStatus.inProgress ? "game-over" : ""
            }`}
            onClick={handleFlagModeToggle}
          >
            🚩 {numFlags}
          </h3>
          <h3 className="timer">⏱️ {timer}</h3>
        </div>
        {gameStatus.inProgress && gameStatus.solutionInitialised ? (
          <button className="restart" onClick={handleGameOver}>
            Solution
          </button>
        ) : (
          <button className="restart" onClick={gameInitialisation}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
