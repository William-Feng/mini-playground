import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../App";
import "./Emoji.css";

function Emoji() {
  const { theme } = useContext(ThemeContext);

  const SIZE = 4;
  const emojis = [
    "😁",
    "😆",
    "😅",
    "😂",
    "😊",
    "😉",
    "😍",
    "😘",
    "😋",
    "🤪",
    "😎",
    "🥺",
    "😢",
    "😭",
    "😠",
    "🤔",
  ];

  const [selected, setSelected] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [gameStatus, setGameStatus] = useState("in-progress");

  const gameInitialisation = () => {
    setSelected(new Set());
    setStreak(0);
    setGameStatus("in-progress");
    return shuffleBoard();
  };

  // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
  const shuffleBoard = () => {
    for (let i = emojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
    }

    // Construct the 2D board using the array of emojis
    const board = [];
    for (let i = 0; i < SIZE; i++) {
      const row = [];
      for (let j = 0; j < SIZE; j++) {
        row.push(emojis[i * SIZE + j]);
      }
      board.push(row);
    }
    return board;
  };

  const [board, setBoard] = useState(gameInitialisation);

  const handleClick = (row, col) => {
    if (gameStatus !== "in-progress") return;

    const clickedEmoji = board[row][col];

    // Game over if the same emoji is clicked twice
    if (selected.has(clickedEmoji)) {
      setGameStatus("game-over");
      return;
    }

    const updateSelected = new Set(selected);
    updateSelected.add(clickedEmoji);
    setSelected(updateSelected);
    setStreak(streak + 1);
  };

  useEffect(() => {
    if (streak === SIZE * SIZE) {
      setGameStatus("game-won");
    } else {
      setBoard(shuffleBoard());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  // Message to be displayed depending on whether user has won
  const message = () => {
    if (gameStatus === "game-won") {
      return <h2>Well done! Streak: {streak}</h2>;
    } else if (gameStatus === "game-over") {
      return <h2>Game Over! Streak: {streak}</h2>;
    } else {
      return <h2>Streak: {streak}</h2>;
    }
  };

  return (
    <div className="background emoji" id={theme}>
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={`cell ${
                gameStatus === "game-over" && selected.has(value)
                  ? "selected"
                  : gameStatus !== "in-progress"
                  ? "stable"
                  : ""
              }`}
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

export default Emoji;
