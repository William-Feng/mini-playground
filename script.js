const boardCells = document.querySelectorAll("[board-cell]");

const COLOUR_HIDDEN = "hidden";
const CELL_STABLE = "stable";
let selected;

newGame();

function newGame() {
  selected = null;
  boardCells.forEach((cell) => {
    cell.classList.add(COLOUR_HIDDEN);
    cell.addEventListener("click", handleClick);
  });
}

function handleClick(e) {
  const cell = e.target;

  // Do not allow the cell to be selected if it's already correct
  if (!cell.classList.contains(CELL_STABLE)) {
    if (!selected) {
      firstSelected(cell);
    } else {
      secondSelected(cell);
    }
  }
}

function firstSelected(cell) {
  // Show the colour of the cell if nothing was selected before in this turn
  cell.classList.remove(COLOUR_HIDDEN);
  selected = cell;
}

function secondSelected(cell) {
  // Another cell was selected before in this turn, and we need to check
  if (selected == cell) {
    // This is if the user selects the same cell twice
    cell.classList.add(COLOUR_HIDDEN);
    selected = null;
  } else if (checkMatching(cell)) {
    // Do not allow the cells to be chosen again
    selected.classList.add(CELL_STABLE);
    cell.classList.add(CELL_STABLE);
    // Check for win condition
    selected = null;
  } else {
    // Show the colour of the cell for 2 seconds, then reset
    cell.classList.remove(COLOUR_HIDDEN);
    setTimeout(() => {
      selected.classList.add(COLOUR_HIDDEN);
      cell.classList.add(COLOUR_HIDDEN);
      selected = null;
    }, 1000);
  }
}

function checkMatching(cell) {
  // Check if the two selected cells have the same underlying colour
  cell.classList.remove(COLOUR_HIDDEN);
  return (
    getComputedStyle(selected).backgroundColor ===
    getComputedStyle(cell).backgroundColor
  );
}
