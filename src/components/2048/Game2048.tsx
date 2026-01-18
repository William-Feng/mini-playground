import { FC, useContext, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { AppContext, AppContextType } from "../../App";
import { newMaxStat } from "../../utils/Stats";
import { Storage } from "../../utils/Storage";
import { STORAGE_KEYS } from "../../constants/storage";
import { GameStatus, NumberBoard } from "../../types/common";
import "./Game2048.css";
type NewCell = { row: number; column: number } | null;

const Game2048: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const SIZE = 4;
  let prevBoard: NumberBoard = [];
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("in-progress");
  const [newCell, setNewCell] = useState<NewCell>(null);

  const gameInitialisation = () => {
    setScore(0);
    setGameStatus("in-progress");
    return initialiseBoard();
  };

  // Generate two cells on an empty board
  const initialiseBoard = (): NumberBoard => {
    let board = [...Array(SIZE)].map(() => Array(SIZE).fill(0));
    let cellsGenerated = 0;

    while (true) {
      let row = Math.floor(Math.random() * SIZE);
      let column = Math.floor(Math.random() * SIZE);

      if (board[row][column] === 0) {
        let chance = Math.floor(Math.random() * 10);
        if (chance === 0) {
          board[row][column] = 4;
        } else {
          board[row][column] = 2;
        }
        cellsGenerated++;
        if (cellsGenerated === 2) return board;
      }
    }
  };

  const [board, setBoard] = useState<NumberBoard>(() => gameInitialisation());

  // Create a copy of the 2D board by value
  const cloneBoard = (board: NumberBoard) => {
    const newBoard = [...board];
    newBoard.forEach((row, rowIndex) => (newBoard[rowIndex] = [...row]));
    return newBoard;
  };

  const isNewlyGenerated = (row: number, column: number) => {
    return newCell && newCell.row === row && newCell.column === column;
  };

  // Generate a new number within the board
  const generateCell = () => {
    while (true) {
      let row = Math.floor(Math.random() * SIZE);
      let column = Math.floor(Math.random() * SIZE);

      if (board[row][column] === 0) {
        // 10% chance of generating a 4, 90% chance of generating a 2
        let chance = Math.floor(Math.random() * 10);
        if (chance === 0) {
          board[row][column] = 4;
        } else {
          board[row][column] = 2;
        }
        setBoard([...board]);
        setNewCell({ row, column });
        setTimeout(() => {
          setNewCell(null);
        }, 500);
        return;
      }
    }
  };

  // Return true if both boards are equivalent
  const checkSame = (boardA: NumberBoard, boardB: NumberBoard) => {
    let equal = true;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (boardA[i][j] !== boardB[i][j]) {
          equal = false;
          break;
        }
      }
    }
    return equal;
  };

  // Generate a cell if the boards before and after are different
  const generateIfValid = () => {
    if (!checkSame(prevBoard, board)) {
      generateCell();
    }
  };

  // Shift board when the left arrow key is pressed or checking game over
  const shiftLeft = (boardShift: boolean) => {
    // Check whether we want to change the original board or create a clone
    let tempBoard = boardShift ? board : cloneBoard(board);
    for (let row = 0; row < SIZE; row++) {
      let boardRow = [...tempBoard[row]];
      tempBoard[row] = rowLeft(boardRow, boardShift);
    }
    if (boardShift) {
      setBoard([...tempBoard]);
    }
    return tempBoard;
  };

  // Shift board when the right arrow key is pressed or checking game over
  const shiftRight = (boardShift: boolean) => {
    let tempBoard = boardShift ? board : cloneBoard(board);
    for (let row = 0; row < SIZE; row++) {
      let boardRow = [...tempBoard[row]];
      // If we have a row [0, 4, 4, 2]
      // This when shifted right, it should be [0, 0, 8, 2]
      // So we must reverse the column before and after the shifting
      tempBoard[row] = rowLeft(boardRow.reverse(), boardShift).reverse();
    }
    if (boardShift) {
      setBoard([...tempBoard]);
    }
    return tempBoard;
  };

  // Shift board when the up arrow key is pressed or checking game over
  const shiftUp = (boardShift: boolean) => {
    let tempBoard = boardShift ? board : cloneBoard(board);
    for (let column = 0; column < SIZE; column++) {
      // Each 'row' becomes the columns of the original board
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(tempBoard[row][column]);
      }
      boardColumn = rowLeft(boardColumn, boardShift);
      for (let row = 0; row < SIZE; row++) {
        tempBoard[row][column] = boardColumn[row];
      }
    }
    if (boardShift) {
      setBoard([...tempBoard]);
    }
    return tempBoard;
  };

  // Shift board when the down arrow key is pressed or checking game over
  const shiftDown = (boardShift: boolean) => {
    let tempBoard = boardShift ? board : cloneBoard(board);
    // Take the transpose of the board, then reverse each row
    for (let column = 0; column < SIZE; column++) {
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(tempBoard[row][column]);
      }
      boardColumn = rowLeft(boardColumn.reverse(), boardShift).reverse();
      for (let row = 0; row < SIZE; row++) {
        tempBoard[row][column] = boardColumn[row];
      }
    }
    if (boardShift) {
      setBoard([...tempBoard]);
    }
    return tempBoard;
  };

  // Main logic for shifting when the arrow keys are pressed
  const rowLeft = (row: number[], boardShift: boolean) => {
    // [2, 2, 0, 2]
    row = filterEmpty(row);
    // [2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        // Do not increase score if this is for checking game over
        if (boardShift) setScore(score + row[i]);
      }
    }
    // [4, 0, 2]
    row = filterEmpty(row);
    // [4, 2]
    while (row.length < SIZE) {
      row.push(0);
    }
    // [4, 2, 0, 0]
    return row;
  };

  // Helper function to temporarily remove cells that are empty
  const filterEmpty = (row: number[]) => {
    return row.filter((num) => num !== 0);
  };

  // Game won if a cell has a value of 2048 or more
  const checkGameWon = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] >= 2048) return true;
      }
    }
    return false;
  };

  // Game over if no more moves can be made (results in same board)
  const checkGameOver = () => {
    // Call the shift functions to check, but do not change the original board
    let leftBoard = shiftLeft(false);
    let rightBoard = shiftRight(false);
    let upBoard = shiftUp(false);
    let downBoard = shiftDown(false);
    let equal =
      checkSame(board, leftBoard) &&
      checkSame(leftBoard, rightBoard) &&
      checkSame(rightBoard, upBoard) &&
      checkSame(upBoard, downBoard);
    if (equal) {
      setGameStatus(checkGameWon() ? "game-won" : "game-over");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shiftBoard = (e: KeyboardEvent) => {
    prevBoard = cloneBoard(board);
    if (e.key === "ArrowLeft") {
      shiftLeft(true);
    } else if (e.key === "ArrowRight") {
      shiftRight(true);
    } else if (e.key === "ArrowUp") {
      shiftUp(true);
    } else if (e.key === "ArrowDown") {
      shiftDown(true);
    }
    generateIfValid();
    checkGameOver();
  };

  // Add event listener for arrow keys
  useEffect(() => {
    document.addEventListener("keydown", shiftBoard);
    return () => {
      document.removeEventListener("keydown", shiftBoard);
    };
  }, [shiftBoard]);

  // Allow swiping on mobile
  const handleSwipe = useSwipeable({
    onSwipedLeft: () => {
      prevBoard = cloneBoard(board);
      shiftLeft(true);
      generateIfValid();
      checkGameOver();
    },
    onSwipedRight: () => {
      prevBoard = cloneBoard(board);
      shiftRight(true);
      generateIfValid();
      checkGameOver();
    },
    onSwipedUp: () => {
      prevBoard = cloneBoard(board);
      shiftUp(true);
      generateIfValid();
      checkGameOver();
    },
    onSwipedDown: () => {
      prevBoard = cloneBoard(board);
      shiftDown(true);
      generateIfValid();
      checkGameOver();
    },
    preventScrollOnSwipe: true,
  });

  // Update the colour of a cell (after the board has shifted)
  const cellClass = (num: number, row: number, column: number) => {
    let classes = "cell";
    if (num) {
      classes += num <= 2048 ? " num" + num : " num4096";
      if (isNewlyGenerated(row, column)) {
        classes += " new";
      }
    }
    return classes;
  };

  // On component mount, load any saved state from local storage
  useEffect(() => {
    const savedBoard = Storage.getItem<NumberBoard>(STORAGE_KEYS.GAME_2048_BOARD, []);
    const savedScore = Storage.getNumber(STORAGE_KEYS.GAME_2048_CURRENT_SCORE, 0);
    const savedGameStatus = Storage.getString(STORAGE_KEYS.GAME_2048_STATUS, "in-progress");

    if (savedBoard.length > 0) {
      setBoard(savedBoard);
      setScore(savedScore);
      setGameStatus(savedGameStatus as GameStatus);
    }
  }, []);

  // Update the game statistics on each turn
  useEffect(() => {
    Storage.setItem(STORAGE_KEYS.GAME_2048_BOARD, board);
    Storage.setNumber(STORAGE_KEYS.GAME_2048_CURRENT_SCORE, score);
    Storage.setString(STORAGE_KEYS.GAME_2048_STATUS, gameStatus);

    newMaxStat("2048", "Maximum Score", STORAGE_KEYS.GAME_2048_MAX_SCORE, score, setGameStat);
  }, [board, score, gameStatus, setGameStat]);

  return (
    <div className="background game2048" id={theme}>
      <div className="board" {...handleSwipe}>
        {board.map((row, i) =>
          row.map((value, j) => (
            <div className={cellClass(value, i, j)} key={`${i}-${j}`}>
              {value === 0 ? "" : value}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {gameStatus === "game-won" && <h2>Well Done!</h2>}
        {gameStatus === "game-over" && <h2>Game Over!</h2>}
        <h3>Score: {score}</h3>
        <button
          className="restart"
          onClick={() => setBoard(gameInitialisation)}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default Game2048;
