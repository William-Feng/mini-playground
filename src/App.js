import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import Navbar from "./components/Navbar";
import Memory from "./components/memory/Memory";
import Game2048 from "./components/2048/Game2048";

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/wordle"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Wordle" />
              <Wordle />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Tic Tac Toe" />
              <TicTacToe />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/memory"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="Memory Game" />
              <Memory />
            </ThemeContext.Provider>
          }
        />
        <Route
          path="/2048"
          element={
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              <Navbar heading="2048" />
              <Game2048 />
            </ThemeContext.Provider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
