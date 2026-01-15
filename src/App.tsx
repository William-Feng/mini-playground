import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Footer from "./components/misc/Footer";
import GameLayout from "./components/misc/GameLayout";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import Memory from "./components/memory/Memory";
import Emoji from "./components/emoji/Emoji";
import Sliding from "./components/sliding/Sliding";
import Game2048 from "./components/2048/Game2048";
import Minesweeper from "./components/minesweeper/Minesweeper";
import LightsOut from "./components/lights-out/LightsOut";
import Othello from "./components/othello/Othello";
import "./App.css";
import { Storage } from "./utils/Storage";

export interface GameStat {
  [key: string]: {
    [key: string]: string | number;
  };
}

export interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  gameStat: GameStat;
  setGameStat: Dispatch<SetStateAction<GameStat>>;
}

const getInitialGameStat = (fromStorage: boolean = true): GameStat => {
  const getStatValue = (key: string, defaultValue: string | number) => {
    if (!fromStorage) return defaultValue;
    if (typeof defaultValue === "number") {
      return Storage.getNumber(key, defaultValue);
    }
    return Storage.getString(key, defaultValue as string);
  };

  return {
    Wordle: {
      "Words Guessed": getStatValue("wordle-guessed", 0) as number,
      "Words Missed": getStatValue("wordle-missed", 0) as number,
    },
    "Tic Tac Toe": {
      "Rounds Drew (1P)": getStatValue("tictactoe-drew", 0) as number,
      "Rounds Lost (1P)": getStatValue("tictactoe-lost", 0) as number,
      "Player X Won (2P)": getStatValue("tictactoe-xWon", 0) as number,
      "Player O Won (2P)": getStatValue("tictactoe-oWon", 0) as number,
      "Players Drew (2P)": getStatValue("tictactoe-drew2P", 0) as number,
    },
    "Colour Matching": {
      "Minimum Turns (Easy)": getStatValue("colour-minTurns-easy", "N/A") as string,
      "Minimum Turns (Medium)": getStatValue("colour-minTurns-medium", "N/A") as string,
      "Minimum Turns (Hard)": getStatValue("colour-minTurns-hard", "N/A") as string,
    },
    "Emoji Streak": {
      "Maximum Streak (Easy)": getStatValue("emoji-maxStreak-easy", 0) as number,
      "Maximum Streak (Medium)": getStatValue("emoji-maxStreak-medium", 0) as number,
      "Maximum Streak (Hard)": getStatValue("emoji-maxStreak-hard", 0) as number,
    },
    "Sliding Puzzle": {
      "Minimum Moves (Easy)": getStatValue("sliding-minMoves-easy", "N/A") as string,
      "Minimum Moves (Hard)": getStatValue("sliding-minMoves-hard", "N/A") as string,
    },
    2048: {
      "Maximum Score": getStatValue("2048-maxScore", 0) as number,
    },
    Minesweeper: {
      "Games Won": getStatValue("minesweeper-won", 0) as number,
      "Games Lost": getStatValue("minesweeper-lost", 0) as number,
      "Minimum Time (Easy)": getStatValue("minesweeper-minTime-easy", "N/A") as string,
      "Minimum Time (Medium)": getStatValue("minesweeper-minTime-medium", "N/A") as string,
      "Minimum Time (Hard)": getStatValue("minesweeper-minTime-hard", "N/A") as string,
    },
    "Lights Out": {
      "Minimum Turns (Easy)": getStatValue("lights-minTurns-easy", "N/A") as string,
      "Minimum Turns (Medium)": getStatValue("lights-minTurns-medium", "N/A") as string,
      "Minimum Turns (Hard)": getStatValue("lights-minTurns-hard", "N/A") as string,
    },
    Othello: {
      "Games Won (1P)": getStatValue("othello-won", 0) as number,
      "Games Lost (1P)": getStatValue("othello-lost", 0) as number,
      "Games Drew (1P)": getStatValue("othello-drew", 0) as number,
      "Light Won (2P)": getStatValue("othello-lightWon", 0) as number,
      "Dark Won (2P)": getStatValue("othello-darkWon", 0) as number,
      "Players Drew (2P)": getStatValue("othello-drew2P", 0) as number,
    },
  };
};

export const AppContext = createContext<AppContextType>({
  theme: "light",
  toggleTheme: () => {},
  gameStat: getInitialGameStat(false),
  setGameStat: () => {},
});

function App() {
  const [theme, setTheme] = useState<string>(
    () => Storage.getString("theme", "light")
  );

  useEffect(() => {
    Storage.setString("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [gameStat, setGameStat] = useState<GameStat>(() => getInitialGameStat());

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, gameStat, setGameStat }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer isHome />
            </>
          }
        />
        <Route
          path="/wordle"
          element={
            <GameLayout heading="Wordle" isWordle>
              <Wordle />
            </GameLayout>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <GameLayout heading="Tic Tac Toe">
              <TicTacToe />
            </GameLayout>
          }
        />
        <Route
          path="/memory"
          element={
            <GameLayout heading="Colour Matching">
              <Memory />
            </GameLayout>
          }
        />
        <Route
          path="/emoji"
          element={
            <GameLayout heading="Emoji Streak">
              <Emoji />
            </GameLayout>
          }
        />
        <Route
          path="/sliding"
          element={
            <GameLayout heading="Sliding Puzzle">
              <Sliding />
            </GameLayout>
          }
        />
        <Route
          path="/2048"
          element={
            <GameLayout heading="2048">
              <Game2048 />
            </GameLayout>
          }
        />
        <Route
          path="/minesweeper"
          element={
            <GameLayout heading="Minesweeper">
              <Minesweeper />
            </GameLayout>
          }
        />
        <Route
          path="/lights-out"
          element={
            <GameLayout heading="Lights Out">
              <LightsOut />
            </GameLayout>
          }
        />
        <Route
          path="/othello"
          element={
            <GameLayout heading="Othello">
              <Othello />
            </GameLayout>
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
