import React, { useContext } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import ReactSwitch from "react-switch";
import "./Navbar.css";

function Navbar({ heading }) {
  const { theme, toggleTheme, gameStat } = useContext(AppContext);

  const gameDescriptions = {
    Wordle:
      "Wordle is a word guessing game where you have a six attempts to guess a secret five-letter word. Letters in the correct position will be green, letters in the wrong position will be yellow and incorrect letters will be grey.",
    "Tic Tac Toe":
      "Tic Tac Toe is a classic two-player game where one player is X and the other is O. The first player to get three of their marks in a row, column or diagonal is the winner (in the one-player mode, just try to aim for a draw).",
    "Colour Matching":
      "Colour Matching involves discovering all the pairs of colours on the board in the fewest number of moves. However, only two tiles are revealed at once, so try to remember the position of every colour.",
    "Emoji Streak":
      "Emoji Streak is a memory game where you need to select all the unique emojis on the board. But beware, the board will shuffle after each selection, so try to extend your streak before your lives run out.",
    "Sliding Puzzle":
      "Sliding Puzzle involves arranging the tiles into ascending order. This is much harder than it seems as the empty tile can only be swapped with an adjacent cell, and the challenge is to move it into the bottom-right corner.",
    2048: "2048 involves combining tiles (swipe or use the arrow keys) with the same number to create a tile of double the value. The goal is to create a tile with the value 2048 and obtain the highest possible score.",
  };

  const gameStats = (game) => {
    const stats = gameStat[game];
    return Object.entries(stats).map(([statName, statValue]) => {
      return `${statName}: ${statValue}`;
    });
  };

  return (
    <div className="theme" id={theme}>
      <div className="navbar">
        <div className="arrow">
          <Link to="/">
            <RiArrowGoBackFill className="back" />
          </Link>
        </div>
        <h1 className="heading">{heading}</h1>
        <div className="info" data-tooltip-id="gameInfo">
          <BsInfoCircle />
        </div>
        <Tooltip id="gameInfo">
          <p>{gameDescriptions[heading]}</p>
          {gameStats(heading).map((stat, index) => (
            <h4 key={index}>{stat}</h4>
          ))}
        </Tooltip>
        <div className="switch">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"}
            onColor={"#027bff"}
            uncheckedIcon={<FaSun className="icon" />}
            checkedIcon={<FaMoon className="icon" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
