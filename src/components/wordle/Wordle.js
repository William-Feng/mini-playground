import { createContext, useContext, useEffect, useState } from "react";
import "./Wordle.css";
import { ThemeContext } from "../../App";
import GameOver from "./GameOver";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { defaultGrid, generateWordbank } from "./Words";

export const AppContext = createContext();

function Wordle() {
  const { theme } = useContext(ThemeContext);
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
    <div className="wordle" id={theme}>
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
        <div className="grid-container">
          <Grid />
        </div>
        {gameOver.gameOver ? <GameOver /> : <Keyboard />}
      </AppContext.Provider>
    </div>
  );
}

export default Wordle;
