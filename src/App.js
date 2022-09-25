import React, { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import Navbar from "./components/Navbar";
import Memory from "./components/memory/Memory";
import Game2048 from "./components/2048/Game2048";
import Footer from "./components/Footer";

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, [[], windowWidth]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme, windowWidth }}>
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
              <Navbar heading="Memory Game" />
              <Memory />
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
