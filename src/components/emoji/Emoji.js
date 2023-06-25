import React, { useContext, useEffect, useMemo, useState } from "react";
import { easyEmojis, hardEmojis } from "./EmojiBank";
import { AppContext } from "../../App";
import "./Emoji.css";
import ModeTab from "../misc/ModeTab";

function Emoji() {
  const { theme, setGameStat } = useContext(AppContext);

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem("emoji-difficulty") || "easy"
  );
  const [selected, setSelected] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [lastClicked, setlastClicked] = useState(null);
  const [gameStatus, setGameStatus] = useState("in-progress");

  const size = useMemo(
    () => (difficulty === "easy" ? 4 : difficulty === "medium" ? 5 : 6),
    [difficulty]
  );

  const hearts = Array.from({ length: lives }, (_, index) => (
    <span key={index}>❤️</span>
  ));

  useEffect(() => {
    setBoard(gameInitialisation(difficulty));
    localStorage.setItem("emoji-difficulty", difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = (difficulty) => {
    setSelected(new Set());
    setStreak(0);
    setLives(3);
    setlastClicked(null);
    setGameStatus("in-progress");

    const emojis =
      difficulty === "easy" ? easyEmojis : randomiseEmojis(hardEmojis);
    return shuffleBoard(emojis);
  };

  // Randomise the emojis for the difficult 5x5 or 6x6 boards from the bank
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

  // Determine whether the cell has been selected before and update states accordingly
  const handleClick = (row, col) => {
    if (gameStatus !== "in-progress") return;

    const clickedEmoji = board[row][col];

    // A life is lost if the same emoji is clicked twice, and game over if all lives are lost
    if (selected.has(clickedEmoji)) {
      if (lives > 1) {
        setLives(lives - 1);
        setlastClicked({ row, col });
      } else {
        setGameStatus("game-over");
      }
      return;
    }

    const updateSelected = new Set(selected);
    updateSelected.add(clickedEmoji);
    setSelected(updateSelected);
    setStreak(streak + 1);
    setlastClicked(null);
  };

  // Shuffle the board whenever the streak is updated and the user hasn't won the game
  useEffect(() => {
    if (streak === size * size) {
      setGameStatus("game-won");
    } else {
      setBoard(shuffleBoard(board.flat()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  // Save the maximum streak to local storage
  useEffect(() => {
    const savedMaxStreak = localStorage.getItem("emoji-maxStreak");
    if (!savedMaxStreak || streak > parseInt(savedMaxStreak)) {
      localStorage.setItem("emoji-maxStreak", streak.toString());
    }

    setGameStat((prevStats) => ({
      ...prevStats,
      "Emoji Streak": {
        ...prevStats["Emoji Streak"],
        "Maximum Streak": Math.max(
          prevStats["Emoji Streak"]["Maximum Streak"],
          streak
        ),
      },
    }));
  }, [difficulty, streak, setGameStat]);

  return (
    <div
      className={
        "background emoji " +
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
              className={`cell ${
                gameStatus === "game-over" && selected.has(value)
                  ? "selected"
                  : lastClicked?.row === i && lastClicked?.col === j
                  ? "selected"
                  : gameStatus === "game-over"
                  ? "stable"
                  : gameStatus === "game-won"
                  ? "won"
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
          <h2>Well Done!</h2>
        ) : gameStatus === "game-over" ? (
          <h2>Game Over!</h2>
        ) : (
          <h2>Lives: {hearts}</h2>
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
