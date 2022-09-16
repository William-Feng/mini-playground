import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="banner">
        <h1 className="title">Mini Playground</h1>
      </div>
      <div className="games">
        <Link to="/wordle">
          <div className="game">Wordle</div>
        </Link>
        <Link to="/wordle">
          <div className="game">Wordle</div>
        </Link>
        <Link to="/wordle">
          <div className="game">Wordle</div>
        </Link>
        <Link to="/wordle">
          <div className="game">Wordle</div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
