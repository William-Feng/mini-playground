import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import WordleLight from "./images/wordle-light.png";
import WordleDark from "./images/wordle-dark.png";
import TicTacToeLight from "./images/tic-tac-toe-light.png";
import TicTacToeDark from "./images/tic-tac-toe-dark.png";
import MemoryLight from "./images/memory-light.png";
import MemoryDark from "./images/memory-dark.png";
import Game2048Light from "./images/2048-light.png";
import Game2048Dark from "./images/2048-dark.png";
import HomeHeading from "./HomeHeading";
import { ThemeContext } from "../../App";

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="home" id={theme}>
      <HomeHeading />
      <div className="games">
        <Link to="/wordle">
          <div className="game">
            {theme === "light" ? (
              <img src={WordleLight} alt="Wordle" />
            ) : (
              <img src={WordleDark} alt="Wordle" />
            )}
            <div className="gameTitle">Wordle</div>
          </div>
        </Link>
        <Link to="/tic-tac-toe">
          <div className="game">
            {theme === "light" ? (
              <img src={TicTacToeLight} alt="Tic Tac Toe" />
            ) : (
              <img src={TicTacToeDark} alt="Tic Tac Toe" />
            )}
            <div className="gameTitle">Tic Tac Toe</div>
          </div>
        </Link>
        <Link to="/memory">
          <div className="game">
            {theme === "light" ? (
              <img src={MemoryLight} alt="Memory Game" />
            ) : (
              <img src={MemoryDark} alt="Memory Game" />
            )}
            <div className="gameTitle">Memory Game</div>
          </div>
        </Link>
        <Link to="/2048">
          <div className="game">
            {theme === "light" ? (
              <img src={Game2048Light} alt="2048" />
            ) : (
              <img src={Game2048Dark} alt="2048" />
            )}
            <div className="gameTitle">2048</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
