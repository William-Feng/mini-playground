import React, { createContext, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import { RiArrowGoBackFill } from "react-icons/ri";
import Navbar from "./components/Navbar";

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
      </Routes>
    </>
  );
}

export default App;
