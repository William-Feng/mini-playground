import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import { RiArrowGoBackFill } from "react-icons/ri";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/wordle"
          element={
            <>
              <Link to="/">
                <RiArrowGoBackFill className="back" />
              </Link>
              <Wordle />
            </>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <>
              <Link to="/">
                <RiArrowGoBackFill className="back" />
              </Link>
              <TicTacToe />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
