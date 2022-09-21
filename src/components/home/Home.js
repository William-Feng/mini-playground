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
        <Link to="/tic-tac-toe">
          <div className="game">Tic Tac Toe</div>
        </Link>
        <Link to="/memory">
          <div className="game">Memory Game</div>
        </Link>
        <Link to="/2048">
          <div className="game">2048</div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
