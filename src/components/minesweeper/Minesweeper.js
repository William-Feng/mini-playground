import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../App";
import "./Minesweeper.css";
import ModeTab from "../misc/ModeTab";

function Minesweeper() {
  const { theme } = useContext(AppContext);

  const [difficulty, setDifficulty] = useState("easy");
  const size = useMemo(() => (difficulty === "easy" ? 8 : 16), [difficulty]);
  const numMines = useMemo(
    () => (difficulty === "easy" ? 10 : 40),
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
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    gameInitialisation();
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
    console.log(solution);
    return solution;
  };

  const revealLogic = (row, col, visited) => {
    if (row < 0 || row >= size || col < 0 || col >= size) return;

    visited[row][col] = true;
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
    setRevealedCells((prev) => [...prev, { row, col }]);
  };

  const checkGameWon = () => {
    let revealed = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Number.isInteger(board[i][j])) {
          revealed++;
        }
      }
    }
    if (revealed === size * size - numMines) {
      setGameStatus({ ...gameStatus, inProgress: false, gameOver: false });
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
    checkGameWon();
  };

  const handleFlag = (e, i, j) => {
    e.preventDefault();
    if (board[i][j] === "") {
      board[i][j] = "🚩";
    } else if (board[i][j] === "🚩") {
      board[i][j] = "";
    } else {
      return;
    }
    setBoard([...board]);
  };

  useEffect(() => {
    if (solution.length > 0 && revealedCells.length > 0) {
      const visited = [...Array(size)].map(() => Array(size).fill(false));
      revealLogic(revealedCells[0].row, revealedCells[0].col, visited);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution]);

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

  return (
    <div className="background minesweeper" id={theme}>
      <ModeTab
        modeType={difficulty}
        handleModeChange={handleDifficultyChange}
        modes={["easy", "hard"]}
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
        {gameStatus.solutionInitialised && !gameStatus.inProgress && (
          <h2>{gameStatus.gameOver ? "Game Over!" : "Well Done!"}</h2>
        )}
        <h3>
          Time Elapsed: <b>{timer}</b>
        </h3>
        <button className="restart" onClick={gameInitialisation}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default Minesweeper;
