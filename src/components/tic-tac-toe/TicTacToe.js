import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import "./TicTacToe.css";
import ModeTab from "../misc/ModeTab";

function TicTacToe() {
  const { theme, setGameStat } = useContext(AppContext);

  const SIZE = 9;
  const [numPlayers, setNumPlayers] = useState(
    localStorage.getItem("tictactoe-numPlayers") || "1 player"
  );
  const [board, setBoard] = useState(Array(SIZE).fill(null));
  const [initialPlayer, setInitialPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const WIN_STATES = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    handleRestart();
    localStorage.setItem("tictactoe-numPlayers", numPlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPlayers]);

  const handleModeChange = (newDifficulty) => {
    setNumPlayers(newDifficulty);
  };

  // Check if a given combination of cells is a winning combination
  const isWinningCombination = (board, combination) => {
    const [cell0, cell1, cell2] = combination;
    return (
      board[cell0] &&
      board[cell0] === board[cell1] &&
      board[cell0] === board[cell2]
    );
  };

  // If there is a winner, return the winning combination
  const getWinner = (board) => {
    for (let combination of WIN_STATES) {
      if (isWinningCombination(board, combination)) {
        return combination;
      }
    }
    return null;
  };

  // Check if a cell index is part of the winning combination
  const isWinningCell = (index) => {
    const winningCombination = getWinner(board);
    return winningCombination && winningCombination.includes(index);
  };

  // Game results in a draw if all the cells are filled up (without a winner)
  const checkDraw = (board) => {
    for (let cell of board) {
      if (!cell) return false;
    }
    return true;
  };

  // Reset the board and all variables for a new game
  const handleRestart = () => {
    setBoard(Array(SIZE).fill(null));
    setTurn(initialPlayer);
    setInitialPlayer(initialPlayer === "X" ? "O" : "X");
    setWinner(null);
  };

  // Update the board, check for any winners and swap turns
  const handleClick = (i) => {
    if (!winner && !board[i]) {
      let newBoard = [...board];
      newBoard[i] = turn === "X" ? "X" : "O";
      setBoard(newBoard);

      const winningCombination = getWinner(newBoard);
      if (winningCombination) {
        setWinner(newBoard[winningCombination[0]]);
      } else if (checkDraw(newBoard)) {
        setWinner("draw");
      }

      setTurn(turn === "X" ? "O" : "X");
    }
  };

  // Evaluate the current board state to determine the score
  const calculateScore = (board, depth) => {
    for (let combination of WIN_STATES) {
      const [cell0, cell1, cell2] = combination;
      if (
        board[cell0] &&
        board[cell0] === board[cell1] &&
        board[cell0] === board[cell2]
      ) {
        return board[cell0] === "O" ? 10 - depth : depth - 10;
      }
    }
    return 0;
  };

  // Minimax algorithm that gets called recursively
  const minimax = (board, depth, maximisingPlayer) => {
    // Prioritise winning as quickly as possible and vice versa
    let score = calculateScore(board, depth);
    if (score !== 0) return score;
    if (checkDraw(board)) return 0;

    // The AI is the maximising player and the human is the minimising player
    if (maximisingPlayer) {
      let best = -Infinity;
      for (let i = 0; i < SIZE; i++) {
        if (!board[i]) {
          board[i] = "O";
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < SIZE; i++) {
        if (!board[i]) {
          board[i] = "X";
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = null;
        }
      }
      return best;
    }
  };

  // Find the index of the best move for the AI
  const makeAIMove = () => {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < SIZE; i++) {
      if (!board[i]) {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestMove = i;
          bestScore = score;
        }
      }
    }
    return bestMove;
  };

  // AI makes a move if it is the AI's turn in 1 player mode
  useEffect(() => {
    if (numPlayers === "1 player" && turn === "O" && !winner) {
      handleClick(makeAIMove());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // Update the game statistics when a winner has been determined
  useEffect(() => {
    const incrementGameStat = (statLabel) => {
      setGameStat((prevStats) => ({
        ...prevStats,
        "Tic Tac Toe": {
          ...prevStats["Tic Tac Toe"],
          [statLabel]: parseInt(prevStats["Tic Tac Toe"][statLabel]) + 1,
        },
      }));
    };

    const incrementStatAndStore = (statLabel, item) => {
      let savedStat = parseInt(localStorage.getItem(item)) || 0;
      localStorage.setItem(item, (savedStat + 1).toString());
      incrementGameStat(statLabel);
    };

    if (!winner) return;

    if (numPlayers === "1 player") {
      if (winner === "draw") {
        incrementStatAndStore("Rounds Drew (1P)", "tictactoe-drew");
      } else if (winner === "O") {
        incrementStatAndStore("Rounds Lost (1P)", "tictactoe-lost");
      }
    } else {
      if (winner === "X") {
        incrementStatAndStore("Player X Won (2P)", "tictactoe-xWon");
      } else if (winner === "O") {
        incrementStatAndStore("Player O Won (2P)", "tictactoe-oWon");
      } else {
        incrementStatAndStore("Players Drew (2P)", "tictactoe-drew2P");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, setGameStat]);

  return (
    <div className="background tic-tac-toe" id={theme}>
      <ModeTab
        modeType={numPlayers}
        handleModeChange={handleModeChange}
        modes={["1 player", "2 players"]}
      />
      <div className="board">
        {board.map((value, i) => (
          <div
            className={`cell ${value || winner ? "stable" : ""} ${
              isWinningCell(i) ? "winning" : ""
            }`}
            key={i}
            onClick={() => handleClick(i)}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="message">
        {!winner ? (
          <h3>Player {turn}'s Turn</h3>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>Player {winner} Wins!</h2>
        )}
        <button className="restart" onClick={() => handleRestart()}>
          Restart
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
