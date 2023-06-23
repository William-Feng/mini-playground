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

export const ThemeContext = createContext();

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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Home />
              <Footer />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/wordle"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Wordle" />
              <Wordle />
              <Footer id="noPhone" />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Tic Tac Toe" />
              <TicTacToe />
              <Footer />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/memory"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Colour Matching" />
              <Memory />
              <Footer />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/emoji"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Emoji Streak" />
              <Emoji />
              <Footer />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/sliding"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Sliding Puzzle" />
              <Sliding />
              <Footer />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/2048"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="2048" />
              <Game2048 />
              <Footer />
            </ThemeContext.Provider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
