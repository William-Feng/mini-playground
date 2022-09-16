import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Wordle from "./components/wordle/Wordle";
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
      </Routes>
    </>
  );
}

export default App;
