import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppContext, AppContextType } from "../../App";
import GameOver from "./GameOver";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import { generateWordbank } from "./Words";
import "./Wordle.css";
import { incrementStat } from "../../utils/Stats";

export interface WordleContextType {
  grid: string[][];
  setGrid: Dispatch<SetStateAction<string[][]>>;
  curr: { attempt: number; letterPos: number };
  setCurr: Dispatch<SetStateAction<{ attempt: number; letterPos: number }>>;
  handleRestart: () => void;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  MAX_ATTEMPTS: number;
  MAX_LETTERS: number;
  secret: string;
  correctLetters: string[];
  setCorrectLetters: Dispatch<SetStateAction<string[]>>;
  partialLetters: string[];
  setPartialLetters: Dispatch<SetStateAction<string[]>>;
  incorrectLetters: string[];
  setIncorrectLetters: Dispatch<SetStateAction<string[]>>;
  gameOver: { gameOver: boolean; guessedWord: boolean };
  setGameOver: Dispatch<
    SetStateAction<{ gameOver: boolean; guessedWord: boolean }>
  >;
}

export const WordleContext = createContext<WordleContextType>({
  grid: Array(6).fill(Array(5).fill("")),
  setGrid: () => {},
  curr: { attempt: 0, letterPos: 0 },
  setCurr: () => {},
  handleRestart: () => {},
  onLetter: () => {},
  onEnter: () => {},
  onDelete: () => {},
  MAX_ATTEMPTS: 6,
  MAX_LETTERS: 5,
  secret: "",
  correctLetters: [],
  setCorrectLetters: () => {},
  partialLetters: [],
  setPartialLetters: () => {},
  incorrectLetters: [],
  setIncorrectLetters: () => {},
  gameOver: { gameOver: false, guessedWord: false },
  setGameOver: () => {},
});

const Wordle: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const MAX_ATTEMPTS = 6;
  const MAX_LETTERS = 5;
  const [grid, setGrid] = useState<string[][]>(
    [...Array(MAX_ATTEMPTS)].map(() => Array(MAX_LETTERS).fill(""))
  );
  const [curr, setCurr] = useState<{ attempt: number; letterPos: number }>({
    attempt: 0,
    letterPos: 0,
  });
  const [wordbank, setWordbank] = useState<Set<string>>(new Set());
  const [secret, setSecret] = useState<string>("");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [partialLetters, setPartialLetters] = useState<string[]>([]);
  const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<{
    gameOver: boolean;
    guessedWord: boolean;
  }>({
    gameOver: false,
    guessedWord: false,
  });
  const [statsUpdated, setStatsUpdated] = useState<boolean>(false);

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
  const onLetter = (letter: string) => {
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

    // Ensure all 5 letters have been flipped before changing the gameOver state
    if (currWord === secret) {
      setTimeout(() => {
        setGameOver({ gameOver: true, guessedWord: true });
      }, 1500);
      return;
    } else if (curr.attempt === MAX_ATTEMPTS - 1) {
      setTimeout(() => {
        setGameOver({ gameOver: true, guessedWord: false });
      }, 1500);
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

  // Update the game statistics when the game is over
  useEffect(() => {
    // Tracking the number of attempts is used for the nav bar pie chart display
    const incrementWordleAttempts = (attempts: number) => {
      let savedAttemptCount = parseInt(
        localStorage.getItem(`wordle-${attempts}attempts`) || "0"
      );
      localStorage.setItem(
        `wordle-${attempts}attempts`,
        (savedAttemptCount + 1).toString()
      );
    };

    if (gameOver.gameOver && !statsUpdated) {
      setStatsUpdated(true);
      if (gameOver.guessedWord) {
        incrementStat("Wordle", "Words Guessed", "wordle-guessed", setGameStat);
        incrementWordleAttempts(curr.attempt);
      } else {
        incrementStat("Wordle", "Words Missed", "wordle-missed", setGameStat);
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
          MAX_ATTEMPTS,
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
};

export default Wordle;
