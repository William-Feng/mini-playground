import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../App";
import "./Sliding.css";

function Sliding() {
  const { theme } = useContext(ThemeContext);

  const SIZE = 3;

  const solution = useMemo(() => {
    const result = [];
    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        row.push(i * SIZE + j + 1);
      }
      result.push(row);
    }
    // There should be an empty cell in the bottom right corner
    result[SIZE - 1][SIZE - 1] = "";
    return result;
  }, []);

  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const gameInitialisation = () => {
    setMoves(0);
    setSolved(false);
    return initialiseBoard();
  };

  const initialiseBoard = () => {
    const numbers = Array.from(
      { length: SIZE * SIZE - 1 },
      (_, index) => index + 1
    );
    numbers.push("");

    // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Construct the 2D board using the array of numbers
    const board = [];
    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        row.push(numbers[i * SIZE + j]);
      }
      board.push(row);
    }

    // Swap the last two numbers if the board is not solvable
    const inversions = countInversions(numbers);
    if (inversions % 2) {
      [board[SIZE - 1][SIZE - 2], board[SIZE - 1][SIZE - 3]] = [
        board[SIZE - 1][SIZE - 3],
        board[SIZE - 1][SIZE - 2],
      ];
    }

    return board;
  };

  // Count the number of inversions in an array, and this must be even for a solvable board
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

  const [board, setBoard] = useState(gameInitialisation);

  const findEmptyCell = (board) => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === "") {
          return [i, j];
        }
      }
    }
    return null;
  };

  const handleClick = (row, col) => {
    if (solved) return;
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const empty_cell = findEmptyCell(board);
    for (const [i, j] of directions) {
      const x = row + i;
      const y = col + j;
      if (x === empty_cell[0] && y === empty_cell[1]) {
        const newBoard = [...board];
        newBoard[x][y] = board[row][col];
        newBoard[row][col] = "";
        setBoard(newBoard);
        setMoves(moves + 1);
        break;
      }
    }
  };

  useEffect(() => {
    const checkWon = () => {
      if (JSON.stringify(board) === JSON.stringify(solution)) {
        setSolved(true);
      }
    };
    checkWon();
  }, [board, solution]);

  // Message to be displayed depending on whether user has won
  const message = () => {
    if (solved) {
      return <h2>Well done! Moves used: {moves}</h2>;
    } else {
      return <h2>Moves: {moves}</h2>;
    }
  };

  return (
    <div className="background sliding" id={theme}>
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
      <div>
        {message()}
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

export default Sliding;
