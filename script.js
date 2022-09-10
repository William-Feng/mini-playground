const cells = document.querySelectorAll(".cell");
const scoreMessage = document.getElementById("score");
const restart = document.getElementById("restart");

const ROWS = 4;
const COLUMNS = 4;
let board;

newGame();
restart.addEventListener("click", newGame);

function newGame() {
  cells.forEach((cell) => {
    cell.classList.value = "cell";
    cell.innerText = "";
  });
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}
