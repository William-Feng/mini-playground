import { FC, useContext, useEffect, useMemo, useState } from "react";
import { AppContext, AppContextType } from "../../App";
import ModeTab from "../misc/ModeTab";
import { newMinStat } from "../../utils/Stats";
import { Storage } from "../../utils/Storage";
import { STORAGE_KEYS } from "../../constants/storage";
import { Difficulty, BooleanBoard } from "../../types/common";
import "./LightsOut.css";

const LightsOut: FC = () => {
  const { theme, setGameStat } = useContext<AppContextType>(AppContext);

  const [difficulty, setDifficulty] = useState(
    (Storage.getString(STORAGE_KEYS.LIGHTS_DIFFICULTY) as Difficulty) || "easy"
  );

  const [board, setBoard] = useState<BooleanBoard>([]);
  const [turns, setTurns] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);

  const size = useMemo(
    () => (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 9),
    [difficulty]
  );

  // After the difficulty is set, load any saved state from local storage and initialise the game
  useEffect(() => {
    const savedBoard = Storage.getItem<BooleanBoard>(STORAGE_KEYS.LIGHTS_BOARD, []);
    const savedTurns = Storage.getNumber(STORAGE_KEYS.LIGHTS_TURNS, 0);
    const savedSolved = Storage.getBoolean(STORAGE_KEYS.LIGHTS_SOLVED, false);

    if (
      savedBoard.length > 0 &&
      savedBoard.length === size
    ) {
      setBoard(savedBoard);
      setTurns(savedTurns);
      setSolved(savedSolved);
    } else {
      gameInitialisation();
    }

    Storage.setString(STORAGE_KEYS.LIGHTS_DIFFICULTY, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleDifficultyChange = (newDifficulty: string) => {
    if (["easy", "medium", "hard"].includes(newDifficulty)) {
      setDifficulty(newDifficulty as Difficulty);
    }
  };

  // Reset the board and all variables for a new game
  const gameInitialisation = () => {
    setTurns(0);
    setSolved(false);
    setBoard(shuffleBoard());
  };

  // Randomise the board by toggling cells to ensure it's solvable
  const shuffleBoard = () => {
    const board = Array.from({ length: size }, () => Array(size).fill(false));
    const directions = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let iteration = 0; iteration < 100; iteration++) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      for (const [i, j] of directions) {
        const [x, y] = [row + i, col + j];
        if (x >= 0 && x < size && y >= 0 && y < size) {
          board[x][y] = !board[x][y];
        }
      }
    }
    return board;
  };

  // Toggle the cell and its neighbours
  const handleClick = (row: number, col: number) => {
    if (solved) return;
    const directions = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const newBoard = board.map((row) => [...row]);
    for (const [i, j] of directions) {
      const [x, y] = [row + i, col + j];
      if (x >= 0 && x < size && y >= 0 && y < size) {
        newBoard[x][y] = !newBoard[x][y];
      }
    }
    setBoard(newBoard);
    setTurns(turns + 1);
  };

  // Check if the board is solved whenever it's updated
  useEffect(() => {
    if (board.length > 0 && board.every((row) => row.every((cell) => !cell))) {
      setSolved(true);
    }
  }, [board]);

  // Save the state of the game to local storage
  useEffect(() => {
    Storage.setItem(STORAGE_KEYS.LIGHTS_BOARD, board);
    Storage.setNumber(STORAGE_KEYS.LIGHTS_TURNS, turns);
    Storage.setBoolean(STORAGE_KEYS.LIGHTS_SOLVED, solved);
  }, [board, turns, solved]);

  // Update the game statistics when the game is over
  useEffect(() => {
    if (!solved) return;

    const statLabel = `Minimum Turns (${
      difficulty === "easy"
        ? "Easy"
        : difficulty === "medium"
        ? "Medium"
        : "Hard"
    })`;

    newMinStat(
      "Lights Out",
      statLabel,
      difficulty === "easy" ? STORAGE_KEYS.LIGHTS_MIN_TURNS_EASY : difficulty === "medium" ? STORAGE_KEYS.LIGHTS_MIN_TURNS_MEDIUM : STORAGE_KEYS.LIGHTS_MIN_TURNS_HARD,
      turns,
      setGameStat
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, setGameStat]);

  return (
    <div
      className={
        "background lights-out " +
        (difficulty === "medium"
          ? "medium"
          : difficulty === "hard"
          ? "hard"
          : "")
      }
      id={theme}
    >
      <ModeTab
        modeType={difficulty}
        handleModeChange={handleDifficultyChange}
        modes={["easy", "medium", "hard"]}
      />
      <div className="board">
        {board.map((row, i) =>
          row.map((value, j) => (
            <div
              className={
                "cell " + (value ? "on" : "off") + (solved ? " stable" : "")
              }
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
            ></div>
          ))
        )}
      </div>
      <div className="message">
        {solved && <h2>Well Done!</h2>}
        <h3>Turns: {turns}</h3>
        <button className="restart" onClick={gameInitialisation}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default LightsOut;
