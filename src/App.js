import { createContext, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

export const AppContext = createContext();

function App() {
  const gridDefault = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  const [grid, setGrid] = useState(gridDefault);
  const [curr, setCurr] = useState({ attempt: 0, letterPos: 0 });

  const onLetter = (letter) => {
    if (curr.letterPos > 4) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos] = letter;
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos + 1 });
  };

  const onEnter = () => {
    if (curr.letterPos < 5) return;
    setCurr({ attempt: curr.attempt + 1, letterPos: 0 });
  };

  const onDelete = () => {
    if (curr.letterPos === 0) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos - 1] = "";
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos - 1 });
  };

  return (
    <div className="App">
      <h1>Wordle</h1>
      <AppContext.Provider
        value={{ grid, setGrid, curr, setCurr, onLetter, onEnter, onDelete }}
      >
        <Grid />
        <Keyboard />
      </AppContext.Provider>
    </div>
  );
}

export default App;
