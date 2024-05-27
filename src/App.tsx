import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/misc/Navbar";
import Footer from "./components/misc/Footer";
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

export const AppContext = createContext<AppContextType>({} as AppContextType);

function App() {
  const [theme, setTheme] = useState<string>(
    () => window.localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [gameStat, setGameStat] = useState<GameStat>({
    Wordle: {
      "Words Guessed": localStorage.getItem("wordle-guessed") || 0,
      "Words Missed": localStorage.getItem("wordle-missed") || 0,
    },
    "Tic Tac Toe": {
      "Rounds Drew (1P)": localStorage.getItem("tictactoe-drew") || 0,
      "Rounds Lost (1P)": localStorage.getItem("tictactoe-lost") || 0,
      "Player X Won (2P)": localStorage.getItem("tictactoe-xWon") || 0,
      "Player O Won (2P)": localStorage.getItem("tictactoe-oWon") || 0,
      "Players Drew (2P)": localStorage.getItem("tictactoe-drew2P") || 0,
    },
    "Colour Matching": {
      "Minimum Turns (Easy)":
        localStorage.getItem("colour-minTurns-easy") || "N/A",
      "Minimum Turns (Medium)":
        localStorage.getItem("colour-minTurns-medium") || "N/A",
      "Minimum Turns (Hard)":
        localStorage.getItem("colour-minTurns-hard") || "N/A",
    },
    "Emoji Streak": {
      "Maximum Streak (Easy)":
        localStorage.getItem("emoji-maxStreak-easy") || 0,
      "Maximum Streak (Medium)":
        localStorage.getItem("emoji-maxStreak-medium") || 0,
      "Maximum Streak (Hard)":
        localStorage.getItem("emoji-maxStreak-hard") || 0,
    },
    "Sliding Puzzle": {
      "Minimum Moves (Easy)":
        localStorage.getItem("sliding-minMoves-easy") || "N/A",
      "Minimum Moves (Hard)":
        localStorage.getItem("sliding-minMoves-hard") || "N/A",
    },
    2048: {
      "Maximum Score": localStorage.getItem("2048-maxScore") || 0,
    },
    Minesweeper: {
      "Games Won": localStorage.getItem("minesweeper-won") || 0,
      "Games Lost": localStorage.getItem("minesweeper-lost") || 0,
      "Minimum Time (Easy)":
        localStorage.getItem("minesweeper-minTime-easy") || "N/A",
      "Minimum Time (Medium)":
        localStorage.getItem("minesweeper-minTime-medium") || "N/A",
      "Minimum Time (Hard)":
        localStorage.getItem("minesweeper-minTime-hard") || "N/A",
    },
    "Lights Out": {
      "Minimum Turns (Easy)":
        localStorage.getItem("lights-minTurns-easy") || "N/A",
      "Minimum Turns (Medium)":
        localStorage.getItem("lights-minTurns-medium") || "N/A",
      "Minimum Turns (Hard)":
        localStorage.getItem("lights-minTurns-hard") || "N/A",
    },
    Othello: {
      "Games Won (1P)": localStorage.getItem("othello-won") || 0,
      "Games Lost (1P)": localStorage.getItem("othello-lost") || 0,
      "Games Drew (1P)": localStorage.getItem("othello-drew") || 0,
      "Light Won (2P)": localStorage.getItem("othello-lightWon") || 0,
      "Dark Won (2P)": localStorage.getItem("othello-darkWon") || 0,
      "Players Drew (2P)": localStorage.getItem("othello-drew2P") || 0,
    },
  });

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Home />
              <Footer isHome />
            </AppContext.Provider>
          }
        />
        <Route
          path="/wordle"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Wordle" />
              <Wordle />
              <Footer isWordle />
            </AppContext.Provider>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Tic Tac Toe" />
              <TicTacToe />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/memory"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Colour Matching" />
              <Memory />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/emoji"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Emoji Streak" />
              <Emoji />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/sliding"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Sliding Puzzle" />
              <Sliding />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/2048"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="2048" />
              <Game2048 />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/minesweeper"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Minesweeper" />
              <Minesweeper />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/lights-out"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Lights Out" />
              <LightsOut />
              <Footer />
            </AppContext.Provider>
          }
        />
        <Route
          path="/othello"
          element={
            <AppContext.Provider
              value={{ theme, toggleTheme, gameStat, setGameStat }}
            >
              <Navbar heading="Othello" />
              <Othello />
              <Footer />
            </AppContext.Provider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
