import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../App";
import ModeTab from "../misc/ModeTab";
import "./Sliding.css";

function Sliding() {
  const { theme } = useContext(ThemeContext);

  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const size = useMemo(() => (difficulty === "easy" ? 3 : 4), [difficulty]);

  useEffect(() => {
    gameInitialisation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // The solution is a 2D array of numbers in ascending order
  // This only gets computed when the board size changes
  const solution = useMemo(() => {
    const result = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j + 1);
      }
      result.push(row);
    }
    // There should be an empty cell in the bottom right corner
    result[size - 1][size - 1] = "";
    return result;
  }, [size]);

  // Reset the board and all variables for a new game
  const gameInitialisation = () => {
    setMoves(0);
    setSolved(false);
    setBoard(shuffleBoard());
  };

  // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
  const shuffleBoard = () => {
    const numbers = Array.from(
      { length: size * size - 1 },
      (_, index) => index + 1
    );
    numbers.push("");

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Construct the 2D board using the array of numbers
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(numbers[i * size + j]);
      }
      board.push(row);
    }

    // Swap the last two numbers if the board is not solvable
    const inversions = countInversions(numbers);
    if (!solvable(size, inversions)) {
      [board[size - 1][size - 2], board[size - 1][size - 3]] = [
        board[size - 1][size - 3],
        board[size - 1][size - 2],
      ];
    }

    return board;
  };

  // Check whether the board after the randomised shuffling is solvable
  const solvable = (size, inversions) => {
    // If odd (3x3 for 8-puzzle), the number of inversions must be even for solvability
    if (size % 2 === 1) {
      return inversions % 2 === 0;
      // If even (4x4 for 15-puzzle), the sum of the permutation parity must be even
    } else {
      const blankRowFromBottom = size - Math.floor(inversions / size) - 1;
      return (inversions + blankRowFromBottom) % 2 === 0;
    }
  };

  // Count the number of inversions in an array
  const countInversions = (arr) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    return inversions;
  };

  // Find the empty cell in the board to determine whether a move is valid
  const findEmptyCell = (board) => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === "") {
          return [i, j];
        }
      }
    }
    return null;
  };

  // Swap the empty cell with the target cell
  const swapCells = (row, col, x, y) => {
    const newBoard = board.map((row) => [...row]);
    newBoard[x][y] = board[row][col];
    newBoard[row][col] = "";
    setBoard(newBoard);
    setMoves(moves + 1);
  };

  // Check if the clicked cell is cardinally adjacent to the empty cell, then swap cells
  const handleClick = (row, col) => {
    if (solved) return;
    const empty_cell = findEmptyCell(board);
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [i, j] of directions) {
      const [x, y] = [row + i, col + j];
      if (x === empty_cell[0] && y === empty_cell[1]) {
        swapCells(row, col, x, y);
        break;
      }
    }
  };

  // Check if the pressed key is a valid arrow key, then swap cells
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyPress = (e) => {
    if (solved) return;
    const empty_cell = findEmptyCell(board);

    const directions = {
      ArrowUp: [1, 0],
      ArrowDown: [-1, 0],
      ArrowLeft: [0, 1],
      ArrowRight: [0, -1],
    };
    const offset = directions[e.key];
    if (!offset) return;

    const [row, col] = [empty_cell[0] + offset[0], empty_cell[1] + offset[1]];
    if (row < 0 || row >= size || col < 0 || col >= size) return;
    swapCells(row, col, empty_cell[0], empty_cell[1]);
  };

  // Check if the board is solved whenever it's updated
  useEffect(() => {
    if (JSON.stringify(board) === JSON.stringify(solution)) {
      setSolved(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div
      className={"background sliding " + (difficulty === "hard" ? "hard" : "")}
      id={theme}
    >
      <ModeTab
        modeType={difficulty}
        handleModeChange={handleDifficultyChange}
        modes={["easy", "hard"]}
      />
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={
                value === "" ? "cell empty" : solved ? "cell stable" : "cell"
              }
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
            >
              {value}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {solved && <h2>Well done!</h2>}
        <h3>Moves: {moves}</h3>
        <button className="restart" onClick={gameInitialisation}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default Sliding;
