import React, { useContext, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { AppContext } from "../../App";
import "./Game2048.css";

function Game2048() {
  const { theme, setGameStat } = useContext(AppContext);

  const SIZE = 4;
  let prevBoard = [];
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("in-progress");

  const gameInitialisation = () => {
    setScore(0);
    setGameStatus(false);
    return initialiseBoard();
  };

  // Generate two cells on an empty board
  const initialiseBoard = () => {
    let board = [...Array(SIZE)].map(() => Array(SIZE).fill(""));
    let cellsGenerated = 0;

    while (true) {
      let row = Math.floor(Math.random() * SIZE);
      let column = Math.floor(Math.random() * SIZE);

      if (board[row][column] === "") {
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

  const [board, setBoard] = useState(gameInitialisation);

  // Create a copy of the 2D board by value
  const cloneBoard = (board) => {
    const newBoard = [...board];
    newBoard.forEach((row, rowIndex) => (newBoard[rowIndex] = [...row]));
    return newBoard;
  };

  // Generate a new number within the board
  const generateCell = () => {
    while (true) {
      let row = Math.floor(Math.random() * SIZE);
      let column = Math.floor(Math.random() * SIZE);

      if (board[row][column] === "") {
        // 10% chance of generating a 4, 90% chance of generating a 2
        let chance = Math.floor(Math.random() * 10);
        if (chance === 0) {
          board[row][column] = 4;
        } else {
          board[row][column] = 2;
        }
        setBoard([...board]);
        return;
      }
    }
  };

  // Return true if both boards are equivalent
  const checkSame = (boardA, boardB) => {
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
  const shiftLeft = (boardShift) => {
    // Check whether we want to change the original board or create a clone
    let tempBoard = boardShift ? board : cloneBoard(board);
    for (let row = 0; row < SIZE; row++) {
      let boardRow = [...tempBoard[row]];
      tempBoard[row] = rowLeft(boardRow, boardShift);
    }
    if (boardShift) {
      setBoard([...tempBoard]);
    } else {
      return tempBoard;
    }
  };

  // Shift board when the right arrow key is pressed or checking game over
  const shiftRight = (boardShift) => {
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
    } else {
      return tempBoard;
    }
  };

  // Shift board when the up arrow key is pressed or checking game over
  const shiftUp = (boardShift) => {
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
    } else {
      return tempBoard;
    }
  };

  // Shift board when the down arrow key is pressed or checking game over
  const shiftDown = (boardShift) => {
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
    } else {
      return tempBoard;
    }
  };

  // Main logic for shifting when the arrow keys are pressed
  const rowLeft = (row, boardShift) => {
    // [2, 2, "", 2]
    row = filterEmpty(row);
    // [2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== "" && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = "";
        // Do not increase score if this is for checking game over
        if (boardShift) setScore(score + row[i]);
      }
    }
    // [4, ", 2]
    row = filterEmpty(row);
    // [4, 2]
    while (row.length < SIZE) {
      row.push("");
    }
    // [4, 2, "", ""]
    return row;
  };

  // Helper function to temporarily remove cells that are empty
  const filterEmpty = (row) => {
    return row.filter((num) => num !== "");
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
  const shiftBoard = (e) => {
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
  const cellClass = (num) => {
    if (!num) {
      return "cell";
    } else if (num <= 2048) {
      return "cell num" + num;
    } else {
      return "cell num4096";
    }
  };

  // On component mount, load any saved state from local storage
  useEffect(() => {
    const savedBoard = localStorage.getItem("2048-board");
    const savedScore = localStorage.getItem("2048-currentScore");
    const savedMaxScore = localStorage.getItem("2048-maxScore");
    const savedGameStatus = localStorage.getItem("2048-gameStatus");

    if (savedBoard && savedScore && savedMaxScore && savedGameStatus) {
      setBoard(JSON.parse(savedBoard));
      setScore(parseInt(savedScore));
      setGameStatus(savedGameStatus);
    }
  }, []);

  // Save the state of the game to local storage
  useEffect(() => {
    localStorage.setItem("2048-board", JSON.stringify(board));
    localStorage.setItem("2048-currentScore", score.toString());
    localStorage.setItem("2048-gameStatus", gameStatus);

    const savedMaxScore = localStorage.getItem("2048-maxScore");
    if (!savedMaxScore || score > parseInt(savedMaxScore)) {
      localStorage.setItem("2048-maxScore", score.toString());
    }

    setGameStat((prevStats) => ({
      ...prevStats,
      2048: {
        ...prevStats["2048"],
        "Maximum Score": Math.max(prevStats["2048"]["Maximum Score"], score),
      },
    }));
  }, [board, score, gameStatus, setGameStat]);

  return (
    <div className="background game2048" id={theme}>
      <div className="board" {...handleSwipe}>
        {board.map((row, i) =>
          row.map((value, j) => (
            <div className={cellClass(value)} key={`${i}-${j}`}>
              {value}
            </div>
          ))
        )}
      </div>
      <div className="message">
        {gameStatus === "game-won" && <h2>Well done!</h2>}
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
}

export default Game2048;
