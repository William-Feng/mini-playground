const cells = [...document.querySelectorAll(".cell")];
const scoreMessage = document.getElementById("score");
const restart = document.getElementById("restart");

const SIZE = 4;
let board = [];
let prevBoard = [];
let score;

newGame();
restart.addEventListener("click", newGame);

function newGame() {
  score = 0;
  board = [];

  initaliseBoard();
  scoreMessage.innerText = score;

  generateCell();
  generateCell();

  prevBoard = cloneBoard(board);

  document.addEventListener("keydown", shiftBoard);
}

// Initialise all cells within the 2D board to be empty
function initaliseBoard() {
  let tempBoard = [];

  cells.forEach((cell) => {
    cell.className = "cell";
    cell.innerText = "";
    tempBoard.push(cell.innerText);
  });
  while (tempBoard.length) {
    board.push(tempBoard.splice(0, SIZE));
  }
}

// Generate a new number within the board
function generateCell() {
  while (true) {
    row = Math.floor(Math.random() * SIZE);
    column = Math.floor(Math.random() * SIZE);

    if (board[row][column] == "") {
      let cell = getCell(row, column);

      // 10% chance of generating a 4, 90% chance of generating a 2
      chance = Math.floor(Math.random() * 10);
      if (chance == 0) {
        board[row][column] = 4;
        cell.innerText = 4;
        cell.classList.add("num4");
      } else {
        board[row][column] = 2;
        cell.innerText = 2;
        cell.classList.add("num2");
      }
      return;
    }
  }
}

// Return the cell with corresponding id based on the row and column provided
function getCell(row, column) {
  return document.getElementById(row.toString() + "-" + column.toString());
}

// Create a copy of the 2D board by value
function cloneBoard(board) {
  const newBoard = [...board];
  newBoard.forEach((row, rowIndex) => (newBoard[rowIndex] = [...row]));
  return newBoard;
}

function shiftBoard(e) {
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
  prevBoard = cloneBoard(board);

  scoreMessage.innerText = score;
}

function generateIfValid() {
  // Check if the board before and after the arrow key was pressed is the same
  let equal = true;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (prevBoard[i][j] != board[i][j]) {
        equal = false;
        break;
      }
    }
  }
  if (!equal) {
    generateCell();
  }
}

function shiftLeft() {
  for (let row = 0; row < SIZE; row++) {
    let boardRow = board[row];
    board[row] = rowLeft(boardRow);
    for (let column = 0; column < SIZE; column++) {
      updateCell(row, column);
    }
  }
}

function shiftRight() {
  for (let row = 0; row < SIZE; row++) {
    let boardRow = board[row];
    // If we have a row [0, 4, 4, 2]
    // This when shifted right, it should be [0, 0, 8, 2]
    // So we must reverse the column before and after the shifting
    board[row] = rowLeft(boardRow.reverse()).reverse();
    for (let column = 0; column < SIZE; column++) {
      updateCell(row, column);
    }
  }
}

function shiftUp() {
  for (let column = 0; column < SIZE; column++) {
    // Each 'row' becomes the columns of the original board
    let boardColumn = [];
    for (let row = 0; row < SIZE; row++) {
      boardColumn.push(board[row][column]);
    }
    boardColumn = rowLeft(boardColumn);
    for (let row = 0; row < SIZE; row++) {
      board[row][column] = boardColumn[row];
      updateCell(row, column);
    }
  }
}

function shiftDown() {
  // Take the transpose of the board, then reverse each row
  for (let column = 0; column < SIZE; column++) {
    let boardColumn = [];
    for (let row = 0; row < SIZE; row++) {
      boardColumn.push(board[row][column]);
    }
    boardColumn = rowLeft(boardColumn.reverse()).reverse();
    for (let row = 0; row < SIZE; row++) {
      board[row][column] = boardColumn[row];
      updateCell(row, column);
    }
  }
}

// Change the text and colour of a cell after the board has shifted
function updateCell(row, column) {
  let cell = getCell(row, column);
  let num = board[row][column];
  cell.className = "cell";
  cell.innerText = num;
  // All numbers over 2048 will have the 'num4096' class (black background)
  if (num <= 2048) {
    cell.classList.add("num" + num);
  } else {
    cell.classList.add("num4096");
  }
}

// Main logic for shifting when the arrow keys are pressed
function rowLeft(row) {
  // [2, 2, "", 2]
  row = filterEmpty(row);
  // [2, 2, 2]
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] != "" && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = "";
      score += row[i];
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
  return row.filter((num) => num != "");
}
