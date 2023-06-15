import React from "react";
import "./ModeTab.css";

function ModeTab({ modeType, handleModeChange, mode1, mode2 }) {
  return (
    <div className="mode-tab">
      <button
        className={modeType === mode1 ? "active" : ""}
        onClick={() => handleModeChange(mode1)}
      >
        {mode1}
      </button>
      <button
        className={modeType === mode2 ? "active" : ""}
        onClick={() => handleModeChange(mode2)}
      >
        {mode2}
      </button>
    </div>
  );
}

export default ModeTab;
