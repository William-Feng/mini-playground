import React, { FC, useContext } from "react";
import Letter from "./Letter";
import { WordleContext, WordleContextType } from "./Wordle";

const Grid: FC = () => {
  const { MAX_ATTEMPTS, MAX_LETTERS } =
    useContext<WordleContextType>(WordleContext);

  return (
    <div className="grid">
      {Array.from({ length: MAX_ATTEMPTS }, (_, attemptNum) => (
        <div className="row" key={attemptNum}>
          {Array.from({ length: MAX_LETTERS }, (_, letterPos) => (
            <Letter
              attemptNum={attemptNum}
              letterPos={letterPos}
              key={letterPos}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
