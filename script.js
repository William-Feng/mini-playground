const boardCells = document.querySelectorAll("[board-cell]");

const COLOUR_HIDDEN = "hidden";
const CELL_STABLE = "stable";
let previous;
let lockBoard;

newGame();

function newGame() {
  previous = null;
  lockBoard = false;
  boardCells.forEach((cell) => {
    cell.classList.add(COLOUR_HIDDEN);
    cell.addEventListener("click", handleClick);
  });
}

function handleClick(e) {
  const cell = e.target;

  if (allowedClick(cell)) {
    if (!previous) {
      firstSelected(cell);
    } else {
      secondSelected(cell);
    }
  }
}

// Prevent clicking if board is locked or the new cell is already correct
function allowedClick(cell) {
  return !lockBoard && !cell.classList.contains(CELL_STABLE);
}

// Show the colour of the cell if nothing was selected before in this turn
function firstSelected(cell) {
  cell.classList.remove(COLOUR_HIDDEN);
  previous = cell;
}

// Another cell was selected before in this turn so we need to check
function secondSelected(cell) {
  if (previous == cell) {
    // If the user selects the same cell twice
    cell.classList.add(COLOUR_HIDDEN);
    previous = null;
  } else if (checkMatch(cell)) {
    // Do not allow the cells to be chosen again
    previous.classList.add(CELL_STABLE);
    cell.classList.add(CELL_STABLE);
    // Check for win condition
    previous = null;
  } else {
    // Show the colour of the cell for 1 second, then reset
    // Present user from selecting cells during this delay
    cell.classList.remove(COLOUR_HIDDEN);
    lockBoard = true;
    setTimeout(() => {
      previous.classList.add(COLOUR_HIDDEN);
      cell.classList.add(COLOUR_HIDDEN);
      previous = null;
      lockBoard = false;
    }, 1000);
  }
}

// Check if the two selected cells have the same underlying colour
function checkMatch(cell) {
  cell.classList.remove(COLOUR_HIDDEN);
  return (
    getComputedStyle(previous).backgroundColor ===
    getComputedStyle(cell).backgroundColor
  );
}
