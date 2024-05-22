import React, { FC, useContext } from "react";
import { AppContext, AppContextType } from "../../App";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import ReactSwitch from "react-switch";
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";
import "./Navbar.css";

const Navbar: FC<{ heading: string }> = ({ heading }) => {
  const { theme, toggleTheme, gameStat } =
    useContext<AppContextType>(AppContext);

  const gameDescriptions: { [key: string]: string } = {
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
    Minesweeper:
      "Minesweeper is a game where you need to clear the board without detonating any hidden mines. Left-click to reveal the adjacent mine counts and right-click (or toggle the flag mode) to mark a cell as a mine.",
    "Lights Out":
      "Lights Out is a game where you need to turn off all the lights on the board in the fewest number of moves. Clicking a cell will toggle the state of that cell and its adjacent cells.",
    Othello:
      "Othello is a game where you need to flip your opponent's pieces to your colour by trapping them between your pieces. The game ends when the board is full or no more moves can be made, with the winner having more pieces.",
  };

  const gameStats = (game: string) => {
    const stats = gameStat[game];
    return Object.entries(stats).map(([statName, statValue]) => {
      return `${statName}: ${statValue}`;
    });
  };

  type WordleData = {
    title: string;
    value: number;
    color: string;
  };

  const wordleData: WordleData[] = [
    {
      title: "1 Attempt",
      value: parseInt(localStorage.getItem("wordle-1attempts") || "0"),
      color: "#fb8072",
    },
    {
      title: "2 Attempts",
      value: parseInt(localStorage.getItem("wordle-2attempts") || "0"),
      color: "#ffffb3",
    },
    {
      title: "3 Attempts",
      value: parseInt(localStorage.getItem("wordle-3attempts") || "0"),
      color: "#bebada",
    },
    {
      title: "4 Attempts",
      value: parseInt(localStorage.getItem("wordle-4attempts") || "0"),
      color: "#b3de69",
    },
    {
      title: "5 Attempts",
      value: parseInt(localStorage.getItem("wordle-5attempts") || "0"),
      color: "#fdb462",
    },
    {
      title: "6 Attempts",
      value: parseInt(localStorage.getItem("wordle-6attempts") || "0"),
      color: "#80b1d3",
    },
  ].filter((data) => data.value !== 0);

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
        <Tooltip id="gameInfo" clickable closeOnEsc>
          <p>{gameDescriptions[heading]}</p>
          {gameStats(heading).map((stat, index) => {
            return <h5 key={index}>{stat}</h5>;
          })}
          {heading === "Wordle" && wordleData.length > 0 && (
            <div className="container">
              <RechartsPieChart width={380} height={250}>
                <Pie
                  data={wordleData}
                  dataKey="value"
                  nameKey="title"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  label
                >
                  {wordleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </RechartsPieChart>
            </div>
          )}
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
};

export default Navbar;
