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

export const AppContext = createContext<AppContextType>({} as AppContextType);

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

  const [gameStat, setGameStat] = useState<GameStat>({
    Wordle: {
      "Words Guessed": Storage.getNumber("wordle-guessed"),
      "Words Missed": Storage.getNumber("wordle-missed"),
    },
    "Tic Tac Toe": {
      "Rounds Drew (1P)": Storage.getNumber("tictactoe-drew"),
      "Rounds Lost (1P)": Storage.getNumber("tictactoe-lost"),
      "Player X Won (2P)": Storage.getNumber("tictactoe-xWon"),
      "Player O Won (2P)": Storage.getNumber("tictactoe-oWon"),
      "Players Drew (2P)": Storage.getNumber("tictactoe-drew2P"),
    },
    "Colour Matching": {
      "Minimum Turns (Easy)": Storage.getString("colour-minTurns-easy", "N/A"),
      "Minimum Turns (Medium)": Storage.getString("colour-minTurns-medium", "N/A"),
      "Minimum Turns (Hard)": Storage.getString("colour-minTurns-hard", "N/A"),
    },
    "Emoji Streak": {
      "Maximum Streak (Easy)": Storage.getNumber("emoji-maxStreak-easy"),
      "Maximum Streak (Medium)": Storage.getNumber("emoji-maxStreak-medium"),
      "Maximum Streak (Hard)": Storage.getNumber("emoji-maxStreak-hard"),
    },
    "Sliding Puzzle": {
      "Minimum Moves (Easy)": Storage.getString("sliding-minMoves-easy", "N/A"),
      "Minimum Moves (Hard)": Storage.getString("sliding-minMoves-hard", "N/A"),
    },
    2048: {
      "Maximum Score": Storage.getNumber("2048-maxScore"),
    },
    Minesweeper: {
      "Games Won": Storage.getNumber("minesweeper-won"),
      "Games Lost": Storage.getNumber("minesweeper-lost"),
      "Minimum Time (Easy)": Storage.getString("minesweeper-minTime-easy", "N/A"),
      "Minimum Time (Medium)": Storage.getString("minesweeper-minTime-medium", "N/A"),
      "Minimum Time (Hard)": Storage.getString("minesweeper-minTime-hard", "N/A"),
    },
    "Lights Out": {
      "Minimum Turns (Easy)": Storage.getString("lights-minTurns-easy", "N/A"),
      "Minimum Turns (Medium)": Storage.getString("lights-minTurns-medium", "N/A"),
      "Minimum Turns (Hard)": Storage.getString("lights-minTurns-hard", "N/A"),
    },
    Othello: {
      "Games Won (1P)": Storage.getNumber("othello-won"),
      "Games Lost (1P)": Storage.getNumber("othello-lost"),
      "Games Drew (1P)": Storage.getNumber("othello-drew"),
      "Light Won (2P)": Storage.getNumber("othello-lightWon"),
      "Dark Won (2P)": Storage.getNumber("othello-darkWon"),
      "Players Drew (2P)": Storage.getNumber("othello-drew2P"),
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
