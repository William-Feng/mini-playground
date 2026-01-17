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
import { Storage } from "../../utils/Storage";

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
    const savedWordbank = Storage.getItem<string[]>("wordle-wordbank", []);
    const savedSecret = Storage.getString("wordle-secret", "");
    const savedGrid = Storage.getItem<string[][]>("wordle-grid", [...Array(6)].map(() => Array(5).fill("")));
    const savedCurr = Storage.getItem<{ attempt: number; letterPos: number }>("wordle-curr", { attempt: 0, letterPos: 0 });
    const savedCorrectLetters = Storage.getItem<string[]>("wordle-correctLetters", []);
    const savedPartialLetters = Storage.getItem<string[]>("wordle-partialLetters", []);
    const savedIncorrectLetters = Storage.getItem<string[]>("wordle-incorrectLetters", []);
    const savedGameOver = Storage.getItem<{ gameOver: boolean; guessedWord: boolean }>("wordle-gameOver", { gameOver: false, guessedWord: false });
    const statsUpdated = Storage.getString("wordle-statsUpdated", "");

    if (
      savedWordbank.length > 0 &&
      savedSecret &&
      savedGrid.length > 0 &&
      savedCurr.attempt !== undefined &&
      savedGameOver.gameOver !== undefined
    ) {
      setWordbank(new Set(savedWordbank));
      setSecret(savedSecret);
      setGrid(savedGrid);
      setCurr(savedCurr);
      setCorrectLetters(savedCorrectLetters);
      setPartialLetters(savedPartialLetters);
      setIncorrectLetters(savedIncorrectLetters);
      setGameOver(savedGameOver);
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
    Storage.setItem("wordle-wordbank", [...wordbank]);
    Storage.setString("wordle-secret", secret);
    Storage.setItem("wordle-grid", grid);
    Storage.setItem("wordle-curr", curr);
    Storage.setItem("wordle-correctLetters", correctLetters);
    Storage.setItem("wordle-partialLetters", partialLetters);
    Storage.setItem("wordle-incorrectLetters", incorrectLetters);
    Storage.setItem("wordle-gameOver", gameOver);
    Storage.setString("wordle-statsUpdated", statsUpdated.toString());
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
      let savedAttemptCount = Storage.getNumber(`wordle-${attempts}attempts`, 0);
      Storage.setNumber(`wordle-${attempts}attempts`, savedAttemptCount + 1);
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
