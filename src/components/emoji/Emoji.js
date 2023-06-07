import React, { useContext, useEffect, useState } from "react";
import { easyEmojis, hardEmojis } from "./EmojiBank";
import { ThemeContext } from "../../App";
import "./Emoji.css";
import DifficultyTab from "../misc/DifficultyTab";

function Emoji() {
  const { theme } = useContext(ThemeContext);

  const [difficulty, setDifficulty] = useState("easy");
  const [selected, setSelected] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [gameStatus, setGameStatus] = useState("in-progress");
  const size = difficulty === "easy" ? 4 : 5;

  useEffect(() => {
    setBoard(gameInitialisation(difficulty));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = (difficulty) => {
    setSelected(new Set());
    setStreak(0);
    setGameStatus("in-progress");

    const emojis =
      difficulty === "easy" ? easyEmojis : randomiseEmojis(hardEmojis);
    return shuffleBoard(emojis);
  };

  // Randomise the emojis for the difficult 5x5 board from the bank
  const randomiseEmojis = (emojis) => {
    const hardEmojis = [];
    while (hardEmojis.length < size * size) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      if (!hardEmojis.includes(randomEmoji)) {
        hardEmojis.push(randomEmoji);
      }
    }
    return hardEmojis;
  };

  // Randomise the order of the cells (Fisher-Yates shuffle algorithm)
  const shuffleBoard = (emojis) => {
    console.log(emojis);
    for (let i = emojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
    }

    // Construct the 2D board using the array of emojis
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(emojis[i * size + j]);
      }
      board.push(row);
    }
    return board;
  };

  const [board, setBoard] = useState(() => gameInitialisation(difficulty));

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
    if (streak === size * size) {
      setGameStatus("game-won");
    } else {
      setBoard(shuffleBoard(board.flat()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  return (
    <div className="background emoji" id={theme}>
      <DifficultyTab
        difficulty={difficulty}
        handleDifficultyChange={handleDifficultyChange}
      />
      <div className={"board " + (difficulty === "hard" ? "hard" : "")}>
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
      <div className="message">
        {gameStatus === "game-won" ? (
          <h2>Well done!</h2>
        ) : gameStatus === "game-over" ? (
          <h2>Game Over!</h2>
        ) : (
          ""
        )}
        <h3>Streak: {streak}</h3>
        <button
          className="restart"
          onClick={() => setBoard(gameInitialisation(difficulty))}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default Emoji;
