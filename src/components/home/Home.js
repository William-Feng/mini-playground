import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import WordleLight from "./images/wordle-light.png";
import TicTacToeLight from "./images/tic-tac-toe-light.png";
import MemoryLight from "./images/memory-light.png";
import Game2048Light from "./images/2048-light.png";
import HomeHeading from "./HomeHeading";

function Home() {
  return (
    <div className="home">
      <HomeHeading />
      <div className="games">
        <Link to="/wordle">
          <div className="game">
            <img src={WordleLight} />
            <div className="gameTitle">Wordle</div>
          </div>
        </Link>
        <Link to="/tic-tac-toe">
          <div className="game">
            <img src={TicTacToeLight} />
            <div className="gameTitle">Tic Tac Toe</div>
          </div>
        </Link>
        <Link to="/memory">
          <div className="game">
            <img src={MemoryLight} />
            <div className="gameTitle">Memory Game</div>
          </div>
        </Link>
        <Link to="/2048">
          <div className="game">
            <img src={Game2048Light} />
            <div className="gameTitle">2048</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
