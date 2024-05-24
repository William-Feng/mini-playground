import React, { FC, useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "../../App";
import { incrementStat } from "../../utils/Stats";
import "./Othello.css";

type Player = "light" | "dark";
type Cell = Player | null;
type Position = { row: number; col: number };

const Othello: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const SIZE = 8;
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const createInitialBoard = (): Cell[][] => {
    const board: Cell[][] = Array.from({ length: SIZE }, () =>
      Array(SIZE).fill(null)
    );
    board[3][3] = "light";
    board[3][4] = "dark";
    board[4][3] = "dark";
    board[4][4] = "light";
    return board;
  };

  const [board, setBoard] = useState<Cell[][]>(createInitialBoard());
  const [player, setPlayer] = useState<Player>("dark");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [skipped, setSkipped] = useState<boolean>(false);

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setPlayer("dark");
    setWinner(null);
    setValidMoves([]);
  };

  // Flip the tiles between the player's starting position and the chosen position
  const flipTiles = (
    board: Cell[][],
    row: number,
    col: number,
    player: Player
  ) => {
    for (const [i, j] of directions) {
      let [x, y] = [row + i, col + j];
      let tilesToFlip = [];
      while (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        if (!board[x][y]) break;
        if (board[x][y] === player) {
          for (const piece of tilesToFlip) {
            board[piece.row][piece.col] = player;
          }
          break;
        }
        tilesToFlip.push({ row: x, col: y });
        x += i;
        y += j;
      }
    }
  };

  const handleClick = (i: number, j: number) => {
    if (winner) return;
    if (validMoves.length === 0) {
      if (skipped === true) {
        setWinner(determineWinner());
        return;
      }
      setSkipped(true);
      setPlayer(player === "light" ? "dark" : "light");
    } else if (
      validMoves.some((position) => position.row === i && position.col === j)
    ) {
      let newBoard = [...board];
      newBoard[i][j] = player;
      flipTiles(newBoard, i, j, player);
      setBoard(newBoard);
      setSkipped(false);
      setPlayer(player === "light" ? "dark" : "light");
    }
  };

  // Winner has more tiles on the board
  const determineWinner = () => {
    let lightTiles = 0;
    let darkTiles = 0;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (!board[row][col]) {
          continue;
        } else if (board[row][col] === "light") {
          lightTiles++;
        } else {
          darkTiles++;
        }
      }
    }
    return lightTiles > darkTiles
      ? "light"
      : lightTiles < darkTiles
      ? "dark"
      : "draw";
  };

  useEffect(() => {
    if (board.every((row) => row.every((cell) => cell !== null))) {
      determineWinner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // Determine the valid moves for the upcoming player
  useEffect(() => {
    const validMoves: Position[] = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col]) continue;
        for (const [i, j] of directions) {
          let [x, y] = [row + i, col + j];
          let valid = false;
          let tilesToFlip: Position[] = [];
          while (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
            if (!board[x][y]) break;
            if (board[x][y] === player) {
              valid = tilesToFlip.length > 0;
              break;
            }
            tilesToFlip.push({ row: x, col: y });
            x += i;
            y += j;
          }
          if (valid) {
            validMoves.push({ row, col });
          }
        }
      }
    }
    setValidMoves(validMoves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, player]);

  const cellClass = (i: number, j: number, value: Cell) => {
    let classes = "cell";
    if (value || winner) {
      classes += " stable";
    } else if (validMoves.some((move) => move.row === i && move.col === j)) {
      classes += " valid";
    } else {
      classes += " stable";
    }
    return classes;
  };

  const capitalise = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Update the game statistics when the game is over
  useEffect(() => {
    if (!winner) return;

    if (winner === "light") {
      incrementStat("Othello", "Light Won", "othello-lightWon", setGameStat);
    } else if (winner === "dark") {
      incrementStat("Othello", "Dark Won", "othello-darkWon", setGameStat);
    } else {
      incrementStat("Othello", "Players Drew", "othello-drew", setGameStat);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, setGameStat]);

  return (
    <div className="background othello" id={theme}>
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={cellClass(i, j, value)}
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
            >
              {value && <div className={`tile-${value}`}></div>}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {!winner ? (
          <h3>{capitalise(player)}'s Turn</h3>
        ) : winner === "draw" ? (
          <h2>Draw!</h2>
        ) : (
          <h2>{winner} Wins!</h2>
        )}
        <button className="restart" onClick={() => handleRestart()}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default Othello;
