import React from "react";
import "./DifficultyTab.css";

function DifficultyTab({ difficulty, handleDifficultyChange }) {
  return (
    <div className="difficulty-tab">
      <button
        className={difficulty === "easy" ? "active" : ""}
        onClick={() => handleDifficultyChange("easy")}
      >
        Easy
      </button>
      <button
        className={difficulty === "hard" ? "active" : ""}
        onClick={() => handleDifficultyChange("hard")}
      >
        Hard
      </button>
    </div>
  );
}

export default DifficultyTab;
