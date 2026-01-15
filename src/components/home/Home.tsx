import { useContext } from "react";
import { Link } from "react-router-dom";
import WordleLight from "./images/wordle-light.png";
import WordleDark from "./images/wordle-dark.png";
import TicTacToeLight from "./images/tic-tac-toe-light.png";
import TicTacToeDark from "./images/tic-tac-toe-dark.png";
import MemoryLight from "./images/memory-light.png";
import MemoryDark from "./images/memory-dark.png";
import EmojiLight from "./images/emoji-light.png";
import EmojiDark from "./images/emoji-dark.png";
import SlidingLight from "./images/sliding-light.png";
import SlidingDark from "./images/sliding-dark.png";
import Game2048Light from "./images/2048-light.png";
import Game2048Dark from "./images/2048-dark.png";
import MinesweeperLight from "./images/minesweeper-light.png";
import MinesweeperDark from "./images/minesweeper-dark.png";
import LightsOutLight from "./images/lights-out-light.png";
import LightsOutDark from "./images/lights-out-dark.png";
import OthelloLight from "./images/othello-light.png";
import OthelloDark from "./images/othello-dark.png";
import HomeHeading from "./HomeHeading";
import { AppContext } from "../../App";
import "./Home.css";

function Home() {
  const { theme } = useContext(AppContext);

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
              <img src={MemoryLight} alt="Colour Matching" />
            ) : (
              <img src={MemoryDark} alt="Colour Matching" />
            )}
            <div className="gameTitle">Colour Matching</div>
          </div>
        </Link>
        <Link to="/emoji">
          <div className="game">
            {theme === "light" ? (
              <img src={EmojiLight} alt="Emoji Streak" />
            ) : (
              <img src={EmojiDark} alt="Emoji Streak" />
            )}
            <div className="gameTitle">Emoji Streak</div>
          </div>
        </Link>
        <Link to="/sliding">
          <div className="game">
            {theme === "light" ? (
              <img src={SlidingLight} alt="Sliding Puzzle" />
            ) : (
              <img src={SlidingDark} alt="Sliding Puzzle" />
            )}
            <div className="gameTitle">Sliding Puzzle</div>
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
        <Link to="/minesweeper">
          <div className="game">
            {theme === "light" ? (
              <img src={MinesweeperLight} alt="Minesweeper" />
            ) : (
              <img src={MinesweeperDark} alt="Minesweeper" />
            )}
            <div className="gameTitle">Minesweeper</div>
          </div>
        </Link>
        <Link to="/lights-out">
          <div className="game">
            {theme === "light" ? (
              <img src={LightsOutLight} alt="Lights Out" />
            ) : (
              <img src={LightsOutDark} alt="Lights Out" />
            )}
            <div className="gameTitle">Lights Out</div>
          </div>
        </Link>
        <Link to="/othello">
          <div className="game">
            {theme === "light" ? (
              <img src={OthelloLight} alt="Othello" />
            ) : (
              <img src={OthelloDark} alt="Othello" />
            )}
            <div className="gameTitle">Othello</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
