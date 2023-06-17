import React from "react";
import "./ModeTab.css";

function ModeTab({ modeType, handleModeChange, modes }) {
  return (
    <div className="mode-tab">
      {modes.map((mode) => (
        <button
          key={mode}
          className={modeType === mode ? "active" : ""}
          onClick={() => handleModeChange(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

export default ModeTab;
