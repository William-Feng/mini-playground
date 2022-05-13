import { createContext, useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import { defaultGrid, generateWordbank } from "./components/Words";

export const AppContext = createContext();

function App() {
  const [grid, setGrid] = useState(defaultGrid);
  const [curr, setCurr] = useState({ attempt: 0, letterPos: 0 });
  const [wordbank, setWordbank] = useState(new Set());
  const [secret, setSecret] = useState("");

  useEffect(() => {
    generateWordbank().then((words) => {
      setWordbank(words.wordbank);
      setSecret(words.secret);
    });
  }, []);

  const onLetter = (letter) => {
    if (curr.letterPos > 4) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos] = letter;
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos + 1 });
  };

  const onEnter = () => {
    if (curr.letterPos < 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += grid[curr.attempt][i];
    }

    if (wordbank.has(currWord)) {
      setCurr({ attempt: curr.attempt + 1, letterPos: 0 });
    } else {
      alert("Not in word list");
    }

    if (currWord === secret) {
      alert("Well done!");
    } else if (curr.attempt === 5) {
      alert("Unlucky, the correct word is " + secret);
    }
  };

  const onDelete = () => {
    if (curr.letterPos === 0) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos - 1] = "";
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos - 1 });
  };

  return (
    <div>
      <h1>Wordle</h1>
      <AppContext.Provider
        value={{
          grid,
          setGrid,
          curr,
          setCurr,
          onLetter,
          onEnter,
          onDelete,
          secret,
        }}
      >
        <Grid />
        <Keyboard />
      </AppContext.Provider>
    </div>
  );
}

export default App;
