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

  scoreMessage.innerText = "Score: " + score;

  generateCell();
  generateCell();
}

// Generate a new number within the board
function generateCell() {
  while (true) {
    row = parseInt(Math.random() * SIZE);
    column = parseInt(Math.random() * SIZE);

    if (board[row][column] == "") {
      cell = getCell(row, column);

      // 10% chance of generating a 4, 90% chance of generating a 2
      chance = parseInt(Math.random() * 10);
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
