import { createContext, useContext, useEffect, useState } from "react";
import "./Wordle.css";
import { AppContext } from "../../App";
import GameOver from "./GameOver";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { generateWordbank } from "./Words";

export const WordleContext = createContext();

function Wordle() {
  const { theme, setGameStat } = useContext(AppContext);

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
  const [statsUpdated, setStatsUpdated] = useState(false);

  // Load any saved state from local storage and initialise the game
  useEffect(() => {
    const savedWordbank = localStorage.getItem("wordle-wordbank");
    const savedSecret = localStorage.getItem("wordle-secret");
    const savedGrid = localStorage.getItem("wordle-grid");
    const savedCurr = localStorage.getItem("wordle-curr");
    const savedCorrectLetters = localStorage.getItem("wordle-correctLetters");
    const savedPartialLetters = localStorage.getItem("wordle-partialLetters");
    const savedIncorrectLetters = localStorage.getItem(
      "wordle-incorrectLetters"
    );
    const savedGameOver = localStorage.getItem("wordle-gameOver");
    const statsUpdated = localStorage.getItem("wordle-statsUpdated");

    if (
      savedWordbank &&
      savedSecret &&
      savedGrid &&
      savedCurr &&
      savedCorrectLetters &&
      savedPartialLetters &&
      savedIncorrectLetters &&
      savedGameOver
    ) {
      setWordbank(new Set(JSON.parse(savedWordbank)));
      setSecret(savedSecret);
      setGrid(JSON.parse(savedGrid));
      setCurr(JSON.parse(savedCurr));
      setCorrectLetters(JSON.parse(savedCorrectLetters));
      setPartialLetters(JSON.parse(savedPartialLetters));
      setIncorrectLetters(JSON.parse(savedIncorrectLetters));
      setGameOver(JSON.parse(savedGameOver));
      setStatsUpdated(statsUpdated === "true");
    } else {
      handleRestart();
    }
  }, []);

  // Reset the grid and all variables for a new game
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
    setStatsUpdated(false);
  };

  // Include the letter onto the grid
  const onLetter = (letter) => {
    if (curr.letterPos >= MAX_LETTERS) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos] = letter;
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos + 1 });
  };

  // Check if the word is correct and update the board/colours and game over status
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

  // Remove the letter from the grid
  const onDelete = () => {
    if (curr.letterPos === 0) return;
    const newGrid = [...grid];
    newGrid[curr.attempt][curr.letterPos - 1] = "";
    setGrid(newGrid);
    setCurr({ ...curr, letterPos: curr.letterPos - 1 });
  };

  // Save the state of the game to local storage
  useEffect(() => {
    localStorage.setItem("wordle-wordbank", JSON.stringify([...wordbank]));
    localStorage.setItem("wordle-secret", secret);
    localStorage.setItem("wordle-grid", JSON.stringify(grid));
    localStorage.setItem("wordle-curr", JSON.stringify(curr));
    localStorage.setItem(
      "wordle-correctLetters",
      JSON.stringify(correctLetters)
    );
    localStorage.setItem(
      "wordle-partialLetters",
      JSON.stringify(partialLetters)
    );
    localStorage.setItem(
      "wordle-incorrectLetters",
      JSON.stringify(incorrectLetters)
    );
    localStorage.setItem("wordle-gameOver", JSON.stringify(gameOver));
    localStorage.setItem("wordle-statsUpdated", statsUpdated.toString());
  }, [
    secret,
    wordbank,
    grid,
    curr,
    correctLetters,
    partialLetters,
    incorrectLetters,
    gameOver,
    statsUpdated,
  ]);

  // Update the number of words guessed/missed only once per game
  useEffect(() => {
    const incrementGameStat = (statLabel) => {
      setGameStat((prevStats) => ({
        ...prevStats,
        Wordle: {
          ...prevStats["Wordle"],
          [statLabel]: parseInt(prevStats["Wordle"][statLabel]) + 1,
        },
      }));
    };

    const incrementStatAndStore = (statLabel, item) => {
      let savedStat = parseInt(localStorage.getItem(item)) || 0;
      localStorage.setItem(item, (savedStat + 1).toString());
      incrementGameStat(statLabel);
    };

    const incrementAttemptAndStore = (attempts) => {
      let savedAttemptCount =
        parseInt(localStorage.getItem(`wordle-${attempts}attempts`)) || 0;
      localStorage.setItem(
        `wordle-${attempts}attempts`,
        (savedAttemptCount + 1).toString()
      );
    };

    if (gameOver.gameOver && !statsUpdated) {
      setStatsUpdated(true);
      if (gameOver.guessedWord) {
        incrementStatAndStore("Words Guessed", "wordle-guessed");
        incrementAttemptAndStore(curr.attempt);
      } else {
        incrementStatAndStore("Words Missed", "wordle-missed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, setGameStat]);

  return (
    <div className="background wordle" id={theme}>
      <WordleContext.Provider
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
      </WordleContext.Provider>
    </div>
  );
}

export default Wordle;
