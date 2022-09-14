const cells = [...document.querySelectorAll(".cell")];
const scoreMessage = document.getElementById("score");
const restart = document.getElementById("restart");

const SIZE = 4;
let board = [];
let score;

newGame();
restart.addEventListener("click", newGame);

function newGame() {
  score = 0;
  board = [];
  tempBoard = [];

  // Initialise all cells within the 2D board to be empty
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.innerText = "";
    tempBoard.push(cell.innerText);
  });
  while (tempBoard.length) {
    board.push(tempBoard.splice(0, SIZE));
  }

  scoreMessage.innerText = score;

  generateCell();
  generateCell();

  document.addEventListener("keyup", shiftBoard);
}

// Generate a new number within the board
function generateCell() {
  while (true) {
    row = Math.floor(Math.random() * SIZE);
    column = Math.floor(Math.random() * SIZE);

    if (board[row][column] == "") {
      console.log("The row is " + row + " and the column is " + column);
      cell = getCell(row, column);

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

function shiftBoard(e) {
  if (e.key === "ArrowLeft") {
    console.log("The left arrow key was pressed");
    shiftLeft();
  } else if (e.key === "ArrowRight") {
    console.log("The right arrow key was pressed");
  } else if (e.key === "ArrowUp") {
    console.log("The up arrow key was pressed");
  } else if (e.key === "ArrowDown") {
    console.log("The down arrow key was pressed");
  }

  scoreMessage.innerText = score;
}

function shiftLeft() {
  for (let row = 0; row < SIZE; row++) {
    let boardRow = board[row];
    board[row] = rowLeft(boardRow);
    for (let column = 0; column < SIZE; column++) {
      let cell = getCell(row, column);
      let num = board[row][column];
      cell.className = "cell";
      cell.innerText = num;
      cell.classList.add("num" + num);
    }
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
