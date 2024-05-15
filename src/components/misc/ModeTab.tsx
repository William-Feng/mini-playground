import React from "react";
import "./ModeTab.css";

type ModeTabProps = {
  modeType: string;
  handleModeChange: (mode: string) => void;
  modes: string[];
};

const ModeTab: React.FC<ModeTabProps> = ({
  modeType,
  handleModeChange,
  modes,
}) => {
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
};

export default ModeTab;
