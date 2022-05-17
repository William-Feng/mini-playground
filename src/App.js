import { createContext, useEffect, useState } from "react";
import "./App.css";
import GameOver from "./components/GameOver";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import { defaultGrid, generateWordbank } from "./components/Words";

export const ThemeContext = createContext();
export const AppContext = createContext();

function App() {
  const [grid, setGrid] = useState(defaultGrid);
  const [curr, setCurr] = useState({ attempt: 0, letterPos: 0 });
  const [wordbank, setWordbank] = useState(new Set());
  const [secret, setSecret] = useState("");
  const [correctLetters, setCorrectLetters] = useState([]);
  const [partialLetters, setPartialLetters] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

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
      return;
    }

    if (currWord === secret) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    } else if (curr.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
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
            correctLetters,
            setCorrectLetters,
            partialLetters,
            setPartialLetters,
            incorrectLetters,
            setIncorrectLetters,
            gameOver,
            setGameOver,
          }}
        >
          <Grid />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </AppContext.Provider>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
