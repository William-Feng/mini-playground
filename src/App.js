import React, { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import Navbar from "./components/misc/Navbar";
import Memory from "./components/memory/Memory";
import Game2048 from "./components/2048/Game2048";
import Footer from "./components/misc/Footer";
import Sliding from "./components/sliding/Sliding";
import Emoji from "./components/emoji/Emoji";
import "./App.css";

export const AppContext = createContext();

function App() {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [gameStat, setGameStat] = useState({
    Wordle: {
      guessed: localStorage.getItem("wordle-guessed") || 0,
      failed: localStorage.getItem("wordle-failed") || 0,
    },
    "Tic Tac Toe": {
      lost: localStorage.getItem("tictactoe-lost") || 0,
      draw: localStorage.getItem("tictactoe-draw") || 0,
    },
    "Colour Matching": {
      minTurns: localStorage.getItem("colour-minTurns") || 0,
    },
    "Emoji Streak": {
      maxStreak: localStorage.getItem("emoji-maxStreak") || 0,
    },
    "Sliding Puzzle": {
      "Minimum Moves": localStorage.getItem("sliding-minMoves") || "N/A",
    },
    2048: {
      "Maximum Score": localStorage.getItem("2048-maxScore") || 0,
    },
  });

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider value={{ theme, toggleTheme }}>
              <Home />
              <Footer />
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
              <Footer id="noPhone" />
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
      </Routes>
    </>
  );
}

export default App;
