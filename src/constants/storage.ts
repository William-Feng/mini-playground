export const STORAGE_KEYS = {
  THEME: "theme",

  // Wordle
  WORDLE_WORDBANK: "wordle-wordbank",
  WORDLE_SECRET: "wordle-secret",
  WORDLE_GRID: "wordle-grid",
  WORDLE_CURRENT: "wordle-curr",
  WORDLE_CORRECT_LETTERS: "wordle-correctLetters",
  WORDLE_PARTIAL_LETTERS: "wordle-partialLetters",
  WORDLE_INCORRECT_LETTERS: "wordle-incorrectLetters",
  WORDLE_GAME_OVER: "wordle-gameOver",
  WORDLE_STATS_UPDATED: "wordle-statsUpdated",
  WORDLE_GUESSED: "wordle-guessed",
  WORDLE_MISSED: "wordle-missed",

  // Tic Tac Toe
  TICTACTOE_NUM_PLAYERS: "tictactoe-numPlayers",
  TICTACTOE_DREW: "tictactoe-drew",
  TICTACTOE_LOST: "tictactoe-lost",
  TICTACTOE_X_WON: "tictactoe-xWon",
  TICTACTOE_O_WON: "tictactoe-oWon",
  TICTACTOE_DREW_2P: "tictactoe-drew2P",

  // Colour Matching
  COLOUR_DIFFICULTY: "colour-difficulty",
  COLOUR_MIN_TURNS_EASY: "colour-minTurns-easy",
  COLOUR_MIN_TURNS_MEDIUM: "colour-minTurns-medium",
  COLOUR_MIN_TURNS_HARD: "colour-minTurns-hard",

  // Emoji
  EMOJI_DIFFICULTY: "emoji-difficulty",
  EMOJI_MAX_STREAK_EASY: "emoji-maxStreak-easy",
  EMOJI_MAX_STREAK_MEDIUM: "emoji-maxStreak-medium",
  EMOJI_MAX_STREAK_HARD: "emoji-maxStreak-hard",

  // Sliding Puzzle
  SLIDING_DIFFICULTY: "sliding-difficulty",
  SLIDING_BOARD: "sliding-board",
  SLIDING_MOVES: "sliding-currentMoves",
  SLIDING_SOLVED: "sliding-solved",
  SLIDING_MIN_MOVES_EASY: "sliding-minMoves-easy",
  SLIDING_MIN_MOVES_HARD: "sliding-minMoves-hard",

  // 2048
  GAME_2048_BOARD: "2048-board",
  GAME_2048_CURRENT_SCORE: "2048-currentScore",
  GAME_2048_MAX_SCORE: "2048-maxScore",
  GAME_2048_STATUS: "2048-gameStatus",

  // Minesweeper
  MINESWEEPER_DIFFICULTY: "minesweeper-difficulty",
  MINESWEEPER_WON: "minesweeper-won",
  MINESWEEPER_LOST: "minesweeper-lost",
  MINESWEEPER_MIN_TIME_EASY: "minesweeper-minTime-easy",
  MINESWEEPER_MIN_TIME_MEDIUM: "minesweeper-minTime-medium",
  MINESWEEPER_MIN_TIME_HARD: "minesweeper-minTime-hard",

  // Lights Out
  LIGHTS_DIFFICULTY: "lights-difficulty",
  LIGHTS_BOARD: "lights-board",
  LIGHTS_TURNS: "lights-currentTurns",
  LIGHTS_SOLVED: "lights-solved",
  LIGHTS_MIN_TURNS_EASY: "lights-minTurns-easy",
  LIGHTS_MIN_TURNS_MEDIUM: "lights-minTurns-medium",
  LIGHTS_MIN_TURNS_HARD: "lights-minTurns-hard",

  // Othello
  OTHELLO_NUM_PLAYERS: "othello-numPlayers",
  OTHELLO_WON: "othello-won",
  OTHELLO_LOST: "othello-lost",
  OTHELLO_DREW: "othello-drew",
  OTHELLO_LIGHT_WON: "othello-lightWon",
  OTHELLO_DARK_WON: "othello-darkWon",
  OTHELLO_DREW_2P: "othello-drew2P",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const getDynamicKey = {
  wordleAttempts: (n: number) => `wordle-${n}attempts` as const,
};
