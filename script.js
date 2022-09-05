const boardCells = document.querySelectorAll("[board-cell]");
boardCells.forEach((cell) => {
  cell.addEventListener("click", handleClick, { once: true });
});
const message = document.getElementById("message");

let xTurn = true;
let gameOver = false;
const WIN_STATES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleClick(e) {
  if (!gameOver) {
    // Place a nought or cross on the cell, and include the class
    const cell = e.target;
    const currentClass = xTurn ? "cross" : "nought";
    cell.innerText = xTurn ? "X" : "O";
    cell.classList.add(currentClass);

    // Check for win and draw states, otherwise switch turns
    if (checkWin(currentClass)) {
      message.innerText = `Player ${xTurn ? "X" : "O"} wins!`;
      gameOver = true;
    } else if (checkDraw()) {
      message.innerText = "Draw!";
    } else {
      xTurn = !xTurn;
    }
  }
}

// If all the indexes within any one of the provided states contain the same class
function checkWin(currentClass) {
  return WIN_STATES.some((state) => {
    return state.every((index) => {
      return boardCells[index].classList.contains(currentClass);
    });
  });
}

// If every cell is filled with either a nought or cross
function checkDraw() {
  return [...boardCells].every((cell) => {
    return (
      cell.classList.contains("cross") || cell.classList.contains("nought")
    );
  });
}
