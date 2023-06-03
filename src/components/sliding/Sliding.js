import React, { useEffect, useMemo, useState } from "react";
import "./Sliding.css";

function Sliding() {
  const SIZE = 3;
  const initialBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, "", 8],
  ];
  const solution = useMemo(
    () => [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, ""],
    ],
    []
  );

  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

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

  return (
    <div className="background sliding">
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className="cell"
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
            >
              {value}
            </div>
          ))
        )}
      </div>
      <div>
        <h2>Moves: {moves}</h2>
        {solved && (
          <h2>
            <b>Solved, well done!</b>
          </h2>
        )}
        <button className="restart" onClick={() => setBoard(initialBoard)}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default Sliding;
