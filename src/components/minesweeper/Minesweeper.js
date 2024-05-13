import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../App";
import "./Minesweeper.css";
import ModeTab from "../misc/ModeTab";

function Minesweeper() {
  const { theme, setGameStat } = useContext(AppContext);

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem("minesweeper-difficulty") || "easy"
  );
  const size = useMemo(
    () => (difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 16),
    [difficulty]
  );
  const numMines = useMemo(
    () => (difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 40),
    [difficulty]
  );

  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [revealedCells, setRevealedCells] = useState([]);
  const [gameStatus, setGameStatus] = useState({
    inProgress: true,
    gameOver: false,
    solutionInitialised: false,
  });
  const [numFlags, setNumFlags] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    gameInitialisation();
    localStorage.setItem("minesweeper-difficulty", difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
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

  const initialiseSolution = (i, j) => {
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

  const revealLogic = (row, col, visited) => {
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
      board[row][col] = adjacentMines;
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

  const handleClick = (i, j) => {
    if (flagMode) {
      return handleFlag(null, i, j);
    }
    if (!gameStatus.solutionInitialised) {
      setRevealedCells([{ row: i, col: j }]);
      setSolution(initialiseSolution(i, j));
      return;
    }
    if (!gameStatus.inProgress) return;
    if (board[i][j] === "🚩") return;
    if (solution[i][j] === 1) {
      return handleGameOver();
    }

    const visited = [...Array(size)].map(() => Array(size).fill(false));
    revealLogic(i, j, visited);
  };

  const handleFlag = (e, i, j) => {
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
    let startTime = null;
    let intervalId = null;

    const updateTimer = () => {
      let currentTime = new Date().getTime();
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
      if (gameStatus.inProgress) {
        clearInterval(intervalId);
      }
    };
  }, [gameStatus]);

  const cellClass = (i, j, value) => {
    let classes = "cell";
    if (revealedCells.some((cell) => cell.row === i && cell.col === j)) {
      classes += " revealed";
      if (value === 1) {
        classes += " one";
      } else if (value === 2) {
        classes += " two";
      } else if (value === 3) {
        classes += " three";
      } else if (value === 4) {
        classes += " four";
      } else if (value === 5) {
        classes += " five";
      } else if (value === 6) {
        classes += " six";
      } else if (value === 7) {
        classes += " seven";
      } else if (value === 8) {
        classes += " eight";
      }
    }
    return classes;
  };

  // Update the game statistics when the game is complete
  useEffect(() => {
    if (!gameStatus.inProgress) {
      if (gameStatus.gameOver) {
        setGameStat((prevStats) => ({
          ...prevStats,
          Minesweeper: {
            ...prevStats["Minesweeper"],
            "Games Lost": parseInt(prevStats["Minesweeper"]["Games Lost"]) + 1,
          },
        }));
        localStorage.setItem(
          "minesweeper-lost",
          (
            (parseInt(localStorage.getItem("minesweeper-lost")) || 0) + 1
          ).toString()
        );
      } else {
        const getShorterTime = (time1, time2) => {
          if (time2 === Infinity) return time1;

          const [min1, sec1] = time1.split(":").map(Number);
          const [min2, sec2] = time2.split(":").map(Number);

          const totalsecs1 = min1 * 60 + sec1;
          const totalsecs2 = min2 * 60 + sec2;

          return totalsecs1 <= totalsecs2 ? time1 : time2;
        };

        const prevMinTimeKey = `Minimum Time (${
          difficulty === "easy"
            ? "Easy"
            : difficulty === "medium"
            ? "Medium"
            : "Hard"
        })`;

        const savedminTimeKey = `minesweeper-minTime-${difficulty}`;
        const savedMinTime = localStorage.getItem(savedminTimeKey);
        localStorage.setItem(
          savedminTimeKey,
          getShorterTime(timer, savedMinTime || Infinity)
        );
        localStorage.setItem(
          "minesweeper-won",
          (
            (parseInt(localStorage.getItem("minesweeper-won")) || 0) + 1
          ).toString()
        );

        setGameStat((prevStats) => ({
          ...prevStats,
          Minesweeper: {
            ...prevStats["Minesweeper"],
            "Games Won": parseInt(prevStats["Minesweeper"]["Games Won"]) + 1,
            [prevMinTimeKey]: getShorterTime(timer, savedMinTime || Infinity),
          },
        }));
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
            className={`flag ${flagMode ? "flag-mode-active" : ""}`}
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
}

export default Minesweeper;
