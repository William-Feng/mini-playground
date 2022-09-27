import { createContext, useContext, useEffect, useState } from "react";
import "./Wordle.css";
import { ThemeContext } from "../../App";
import GameOver from "./GameOver";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { generateWordbank } from "./Words";

export const AppContext = createContext();

function Wordle() {
  const { theme } = useContext(ThemeContext);
  const MAX_ATTEMPTS = 6;
  const MAX_LETTERS = 5;

  const [grid, setGrid] = useState(
    [...Array(MAX_ATTEMPTS)].map(() => Array(MAX_LETTERS).fill(""))
  );
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

  const handleRestart = () => {
    generateWordbank().then((words) => {
      setWordbank(words.wordbank);
      setSecret(words.secret);
    });
    setGrid([...Array(MAX_ATTEMPTS)].map(() => Array(MAX_LETTERS).fill("")));
    setCurr({ attempt: 0, letterPos: 0 });
    setCorrectLetters([]);
    setPartialLetters([]);
    setIncorrectLetters([]);
    setGameOver({ gameOver: false, guessedWord: false });
  };

  useEffect(() => {
    handleRestart();
  }, []);

  const onLetter = (letter) => {
    if (curr.letterPos >= MAX_LETTERS) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos] = letter;
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos + 1 });
  };

  const onEnter = () => {
    if (curr.letterPos < MAX_LETTERS) return;

    let currWord = "";
    for (let i = 0; i < MAX_LETTERS; i++) {
      currWord += grid[curr.attempt][i];
    }

    if (wordbank.has(currWord)) {
      setCurr({ attempt: curr.attempt + 1, letterPos: 0 });
    } else {
      alert("Not a word!");
      return;
    }

    if (currWord === secret) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    } else if (curr.attempt === MAX_ATTEMPTS - 1) {
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
          handleRestart,
          onLetter,
          onEnter,
          onDelete,
          MAX_LETTERS,
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
