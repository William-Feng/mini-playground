import React, { useState } from "react";
import "./Sliding.css";

function Sliding() {
  const SIZE = 3;
  const initialBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, "", 8],
  ];
  const solution = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, ""],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  return (
    <div className="background sliding">
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div className="cell" key={`${i}-${j}`}>
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
