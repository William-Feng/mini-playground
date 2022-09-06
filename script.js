const boardCells = document.querySelectorAll("[board-cell]");

const COLOUR_HIDDEN = "hidden";

newGame();

function newGame() {
  boardCells.forEach((cell) => {
    cell.classList.add(COLOUR_HIDDEN);
    cell.addEventListener("click", handleClick);
  });
}

function handleClick(e) {
  const cell = e.target;
  let hidden = cell.classList.contains(COLOUR_HIDDEN);
  if (hidden) {
    cell.classList.remove(COLOUR_HIDDEN);
  } else {
    cell.classList.add(COLOUR_HIDDEN);
  }
}
