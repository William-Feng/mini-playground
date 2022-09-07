const boardCells = document.querySelectorAll(".cell");
const turnMessage = document.getElementById("turns");
const restart = document.getElementById("restart");

const COLOUR_HIDDEN = "hidden";
const CELL_STABLE = "stable";
const WIN_NUM_MATCH = boardCells.length / 2;
let previous;
let lockBoard;
let numTurns;
let numMatching;

newGame();
restart.addEventListener("click", newGame);

function newGame() {
  previous = null;
  lockBoard = false;
  numTurns = 0;
  numMatching = 0;
  turnMessage.innerText = "Turns: 0";
  boardCells.forEach((cell) => {
    cell.classList.add(COLOUR_HIDDEN);
    cell.classList.remove(CELL_STABLE);
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
  numTurns++;
  turnMessage.innerText = "Turns: " + numTurns;
  if (previous == cell) {
    // If the user selects the same cell twice
    cell.classList.add(COLOUR_HIDDEN);
    previous = null;
  } else if (checkMatch(cell)) {
    // Do not allow the cells to be chosen again
    previous.classList.add(CELL_STABLE);
    cell.classList.add(CELL_STABLE);
    previous = null;
    numMatching++;
    checkWin();
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

// Adjust the message if there is a win
function checkWin() {
  if (numMatching === WIN_NUM_MATCH) {
    if (numTurns <= 30) {
      turnMessage.innerText = "Well done! Turns: " + numTurns;
    } else {
      turnMessage.innerText = "You won! Turns: " + numTurns;
    }
  }
}
