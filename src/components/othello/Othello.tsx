import { FC, useContext, useEffect, useState } from "react";
import { AppContext, AppContextType } from "../../App";
import { incrementStat } from "../../utils/Stats";
import { Storage } from "../../utils/Storage";
import "./Othello.css";
import ModeTab from "../misc/ModeTab";

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
  const [numPlayers, setNumPlayers] = useState<string>(
    Storage.getString("othello-numPlayers", "1 player")
  );
  const [player, setPlayer] = useState<Player>("dark");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [skipped, setSkipped] = useState<boolean>(false);
  const [skippedPlayer, setSkippedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    handleRestart();
    Storage.setString("othello-numPlayers", numPlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPlayers]);

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setPlayer("dark");
    setWinner(null);
    setValidMoves([]);
    setSkipped(false);
    setSkippedPlayer(null);
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
          for (const tile of tilesToFlip) {
            board[tile.row][tile.col] = player;
          }
          break;
        }
        tilesToFlip.push({ row: x, col: y });
        x += i;
        y += j;
      }
    }
  };

  const handleClick = ({ row: i, col: j }: Position) => {
    if (winner) return;
    if (
      numPlayers === "2 players" &&
      !validMoves.some((position) => position.row === i && position.col === j)
    )
      return;

    let newBoard = [...board];
    newBoard[i][j] = player;
    flipTiles(newBoard, i, j, player);
    setBoard(newBoard);
    setSkipped(false);
    setSkippedPlayer(null);
    setPlayer(player === "light" ? "dark" : "light");
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

  // Calculate the valid moves for the particular player
  const calculateValidMoves = (board: Cell[][], player: Player) => {
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
    return validMoves;
  };

  // AI makes a randomised move if it is the AI's turn in 1 player mode
  // Check for skipped turns or a new winner and switch the player
  useEffect(() => {
    const currentValidMoves = calculateValidMoves(board, player);
    setValidMoves(currentValidMoves);

    if (currentValidMoves.length === 0) {
      if (skipped) {
        setWinner(determineWinner());
      } else {
        setSkipped(true);
        setSkippedPlayer(player);
        setPlayer(player === "light" ? "dark" : "light");
      }
    } else {
      setSkipped(false);

      if (numPlayers === "1 player" && player === "light" && !winner) {
        const randomisedMove =
          currentValidMoves[
            Math.floor(Math.random() * currentValidMoves.length)
          ];
        setTimeout(() => handleClick(randomisedMove), 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, player]);

  // Update the game statistics when the game is over
  useEffect(() => {
    if (!winner) return;

    if (numPlayers === "1 player") {
      if (winner === "light") {
        incrementStat(
          "Othello",
          "Games Lost (1P)",
          "othello-lost",
          setGameStat
        );
      } else if (winner === "dark") {
        incrementStat("Othello", "Games Won (1P)", "othello-won", setGameStat);
      } else {
        incrementStat(
          "Othello",
          "Games Drew (1P)",
          "othello-drew",
          setGameStat
        );
      }
    } else {
      if (winner === "light") {
        incrementStat(
          "Othello",
          "Light Won (2P)",
          "othello-lightWon",
          setGameStat
        );
      } else if (winner === "dark") {
        incrementStat(
          "Othello",
          "Dark Won (2P)",
          "othello-darkWon",
          setGameStat
        );
      } else {
        incrementStat(
          "Othello",
          "Players Drew (2P)",
          "othello-drew2P",
          setGameStat
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, setGameStat]);

  // Display the number of tiles for each player
  const countTiles = (player: Player) => {
    return board.flat().filter((cell) => cell === player).length;
  };

  const cellClass = (i: number, j: number, value: Cell) => {
    let classes = "cell";
    if (value || winner) {
      classes += " stable";
    } else if (validMoves.some((move) => move.row === i && move.col === j)) {
      classes += " valid";
    } else if (skipped) {
      classes += " valid";
    } else {
      classes += " stable";
    }
    return classes;
  };

  const capitalise = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="background othello" id={theme}>
      <ModeTab
        modeType={numPlayers}
        handleModeChange={(mode: string) => {
          setNumPlayers(mode);
        }}
        modes={["1 player", "2 players"]}
      />
      <div className="tile-counter">
        <div className="light-counter">
          <div className="tile-light"></div>
          <span>{countTiles("light")}</span>
        </div>
        <div className="dark-counter">
          <div className="tile-dark"></div>
          <span>{countTiles("dark")}</span>
        </div>
      </div>
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={cellClass(i, j, value)}
              key={`${i}-${j}`}
              onClick={() => handleClick({ row: i, col: j })}
            >
              {value && <div className={`tile-${value}`}></div>}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {!winner ? (
          <h3>
            {capitalise(player)}'s Turn
            {skippedPlayer && <em> (skipped {capitalise(skippedPlayer)})</em>}
          </h3>
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
