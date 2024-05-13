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
  const [currentClick, setCurrentClick] = useState({ i: null, j: null });
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

  const revealLogic = (i, j) => {
    board[i][j] = 1;
    setBoard([...board]);
  };

  const handleClick = (i, j) => {
    if (!gameStatus.solutionInitialised) {
      setCurrentClick({ i, j });
      setSolution(initialiseSolution(i, j));
      return;
    }
    if (!gameStatus.inProgress) return;
    if (board[i][j] === "🚩") return;
    if (solution[i][j] === 1) {
      setGameStatus({ ...gameStatus, gameOver: true });
    }
    revealLogic(i, j);
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
    if (solution.length > 0 && currentClick.i !== null) {
      revealLogic(currentClick.i, currentClick.j);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution, currentClick]);

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
              className="cell"
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
