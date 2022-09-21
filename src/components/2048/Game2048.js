import React, { useEffect, useState } from "react";
import "./Game2048.css";

function Game2048() {
  const SIZE = 4;
  let prevBoard = [];
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameInitialisation = () => {
    setScore(0);
    setGameOver(false);
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

  /*
  let prevBoard = [];
  
  newGame();
  restart.addEventListener("click", newGame);
  
  function newGame() {
    board = [];
    score = 0;
  
    initaliseBoard();
    scoreMessage.innerText = score;
  
    generateCell();
    generateCell();
  
    prevBoard = cloneBoard(board);
  
    document.addEventListener("keydown", shiftBoard);
  }
  */

  // Create a copy of the 2D board by value
  function cloneBoard(board) {
    const newBoard = [...board];
    newBoard.forEach((row, rowIndex) => (newBoard[rowIndex] = [...row]));
    return newBoard;
  }

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

  // Generate a cell if the board before and after are different
  const generateIfValid = () => {
    if (!checkSame(prevBoard, board)) {
      generateCell();
    }
  };

  // Shift board when the left arrow key is pressed
  const shiftLeft = () => {
    for (let row = 0; row < SIZE; row++) {
      let boardRow = board[row];
      board[row] = rowLeft(boardRow, true);
    }
    setBoard([...board]);
  };

  // Shift board when the right arrow key is pressed
  const shiftRight = () => {
    for (let row = 0; row < SIZE; row++) {
      let boardRow = board[row];
      // If we have a row [0, 4, 4, 2]
      // This when shifted right, it should be [0, 0, 8, 2]
      // So we must reverse the column before and after the shifting
      board[row] = rowLeft(boardRow.reverse(), true).reverse();
    }
    setBoard([...board]);
  };

  // Shift board when the up arrow key is pressed
  const shiftUp = () => {
    for (let column = 0; column < SIZE; column++) {
      // Each 'row' becomes the columns of the original board
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(board[row][column]);
      }
      boardColumn = rowLeft(boardColumn, true);
      for (let row = 0; row < SIZE; row++) {
        board[row][column] = boardColumn[row];
      }
    }
    setBoard([...board]);
  };

  // Shift board when the down arrow key is pressed
  const shiftDown = () => {
    // Take the transpose of the board, then reverse each row
    for (let column = 0; column < SIZE; column++) {
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(board[row][column]);
      }
      boardColumn = rowLeft(boardColumn.reverse(), true).reverse();
      for (let row = 0; row < SIZE; row++) {
        board[row][column] = boardColumn[row];
      }
    }
    setBoard([...board]);
  };

  // Main logic for shifting when the arrow keys are pressed
  function rowLeft(row, increaseScore) {
    // [2, 2, "", 2]
    row = filterEmpty(row);
    // [2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== "" && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = "";
        if (increaseScore) {
          setScore(score + row[i]);
        }
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
  }

  // Helper function to temporarily remove cells that are empty
  function filterEmpty(row) {
    return row.filter((num) => num !== "");
  }

  /*
  // Game over if no more moves can be made (results in same board)
  function checkGameOver() {
    let leftBoard = checkLeft();
    let rightBoard = checkRight();
    let upBoard = checkUp();
    let downBoard = checkDown();
    let equal =
    checkSame(board, leftBoard) &&
    checkSame(leftBoard, rightBoard) &&
    checkSame(rightBoard, upBoard) &&
    checkSame(upBoard, downBoard);
    if (equal) {
      scoreMessage.innerHTML = score + "<br><b>GAME OVER</b>";
    }
  }
  
  // Helper function to check if the game is over
  function checkLeft() {
    let leftBoard = cloneBoard(board);
    let tempBoard = cloneBoard(board);
    for (let row = 0; row < SIZE; row++) {
      let boardRow = tempBoard[row];
      leftBoard[row] = rowLeft(boardRow, false);
    }
    return leftBoard;
  }
  
  // Helper function to check if the game is over
  function checkRight() {
    let rightBoard = cloneBoard(board);
    let tempBoard = cloneBoard(board);
    for (let row = 0; row < SIZE; row++) {
      let boardRow = tempBoard[row];
      rightBoard[row] = rowLeft(boardRow.reverse(), false).reverse();
    }
    return rightBoard;
  }
  
  // Helper function to check if the game is over
  function checkUp() {
    let upBoard = cloneBoard(board);
    let tempBoard = cloneBoard(board);
    for (let column = 0; column < SIZE; column++) {
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(tempBoard[row][column]);
      }
      boardColumn = rowLeft(boardColumn, false);
      for (let row = 0; row < SIZE; row++) {
        upBoard[row][column] = boardColumn[row];
      }
    }
    return upBoard;
  }
  
  // Helper function to check if the game is over
  function checkDown() {
    let downBoard = cloneBoard(board);
    let tempBoard = cloneBoard(board);
    for (let column = 0; column < SIZE; column++) {
      let boardColumn = [];
      for (let row = 0; row < SIZE; row++) {
        boardColumn.push(tempBoard[row][column]);
      }
      boardColumn = rowLeft(boardColumn.reverse(), false).reverse();
      for (let row = 0; row < SIZE; row++) {
        downBoard[row][column] = boardColumn[row];
      }
    }
    return downBoard;
  }
  */

  const shiftBoard = (e) => {
    prevBoard = cloneBoard(board);
    if (e.key === "ArrowLeft") {
      shiftLeft();
    } else if (e.key === "ArrowRight") {
      shiftRight();
    } else if (e.key === "ArrowUp") {
      shiftUp();
    } else if (e.key === "ArrowDown") {
      shiftDown();
    }

    // Invalid move if the board is the same after the arrow key is pressed
    generateIfValid();

    // checkGameOver();
    prevBoard = cloneBoard(board);
  };

  useEffect(() => {
    document.addEventListener("keydown", shiftBoard);
    return () => {
      document.removeEventListener("keydown", shiftBoard);
    };
  }, [shiftBoard]);

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

  return (
    <div className="container" id="game2048">
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div className={cellClass(value)} key={`${i}-${j}`}>
              {value}
            </div>
          ))
        )}
      </div>
      <div>
        <h2>Score: {score}</h2>
        {gameOver ? (
          <h2>
            <b>GAME OVER</b>
          </h2>
        ) : (
          ""
        )}
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
