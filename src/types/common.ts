export type Difficulty = "easy" | "medium" | "hard";

export type GameMode = "1 player" | "2 players";

export type GameStatus =
  | "in-progress"
  | "game-over"
  | "game-won"
  | "won"
  | "lost"
  | "draw";

export interface BaseGameProps {
  theme?: string;
}

export interface GameWithDifficulty extends BaseGameProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export interface GameWithMode extends BaseGameProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export type CellValue = string | null;

export interface BoardPosition {
  row: number;
  col: number;
}

export interface GameScore {
  current: number;
  best: number;
}

export type NumberBoard = number[][];
export type BooleanBoard = boolean[][];
export type StringBoard = string[][];
export type TicTacToeBoard = (string | null)[];

export interface MemoryCell {
  colour: string;
  status: "hidden" | "stable" | "";
}

export interface MinesweeperCell {
  value: number | "💣";
  isRevealed: boolean;
  isFlagged: boolean;
}

export interface WordleGuess {
  attempt: number;
  letterPos: number;
}
