import { Storage } from "../utils/Storage";
import { STORAGE_KEYS } from "../constants/storage";

export interface StatDefinition {
  key: string;
  label: string;
  defaultValue: string | number;
  type: "number" | "string";
}

export interface GameStatConfig {
  [gameName: string]: StatDefinition[];
}

export const gameStatsConfig: GameStatConfig = {
  Wordle: [
    { key: STORAGE_KEYS.WORDLE_GUESSED, label: "Words Guessed", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.WORDLE_MISSED, label: "Words Missed", defaultValue: 0, type: "number" },
  ],
  "Tic Tac Toe": [
    { key: STORAGE_KEYS.TICTACTOE_DREW, label: "Rounds Drew (1P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.TICTACTOE_LOST, label: "Rounds Lost (1P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.TICTACTOE_X_WON, label: "Player X Won (2P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.TICTACTOE_O_WON, label: "Player O Won (2P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.TICTACTOE_DREW_2P, label: "Players Drew (2P)", defaultValue: 0, type: "number" },
  ],
  "Colour Matching": [
    { key: STORAGE_KEYS.COLOUR_MIN_TURNS_EASY, label: "Minimum Turns (Easy)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.COLOUR_MIN_TURNS_MEDIUM, label: "Minimum Turns (Medium)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.COLOUR_MIN_TURNS_HARD, label: "Minimum Turns (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "Emoji Streak": [
    { key: STORAGE_KEYS.EMOJI_MAX_STREAK_EASY, label: "Maximum Streak (Easy)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.EMOJI_MAX_STREAK_MEDIUM, label: "Maximum Streak (Medium)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.EMOJI_MAX_STREAK_HARD, label: "Maximum Streak (Hard)", defaultValue: 0, type: "number" },
  ],
  "Sliding Puzzle": [
    { key: STORAGE_KEYS.SLIDING_MIN_MOVES_EASY, label: "Minimum Moves (Easy)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.SLIDING_MIN_MOVES_HARD, label: "Minimum Moves (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "2048": [
    { key: STORAGE_KEYS.GAME_2048_MAX_SCORE, label: "Maximum Score", defaultValue: 0, type: "number" },
  ],
  Minesweeper: [
    { key: STORAGE_KEYS.MINESWEEPER_WON, label: "Games Won", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.MINESWEEPER_LOST, label: "Games Lost", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.MINESWEEPER_MIN_TIME_EASY, label: "Minimum Time (Easy)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.MINESWEEPER_MIN_TIME_MEDIUM, label: "Minimum Time (Medium)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.MINESWEEPER_MIN_TIME_HARD, label: "Minimum Time (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "Lights Out": [
    { key: STORAGE_KEYS.LIGHTS_MIN_TURNS_EASY, label: "Minimum Turns (Easy)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.LIGHTS_MIN_TURNS_MEDIUM, label: "Minimum Turns (Medium)", defaultValue: "N/A", type: "string" },
    { key: STORAGE_KEYS.LIGHTS_MIN_TURNS_HARD, label: "Minimum Turns (Hard)", defaultValue: "N/A", type: "string" },
  ],
  Othello: [
    { key: STORAGE_KEYS.OTHELLO_WON, label: "Games Won (1P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.OTHELLO_LOST, label: "Games Lost (1P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.OTHELLO_DREW, label: "Games Drew (1P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.OTHELLO_LIGHT_WON, label: "Light Won (2P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.OTHELLO_DARK_WON, label: "Dark Won (2P)", defaultValue: 0, type: "number" },
    { key: STORAGE_KEYS.OTHELLO_DREW_2P, label: "Players Drew (2P)", defaultValue: 0, type: "number" },
  ],
};

export interface GameStat {
  [key: string]: {
    [key: string]: string | number;
  };
}

export const getInitialGameStat = (fromStorage: boolean = true): GameStat => {
  const result: GameStat = {};

  for (const [gameName, stats] of Object.entries(gameStatsConfig)) {
    result[gameName] = {};
    for (const stat of stats) {
      let value = stat.defaultValue;
      if (fromStorage) {
        if (stat.type === "number") {
          value = Storage.getNumber(stat.key, stat.defaultValue as number);
        } else {
          value = Storage.getString(stat.key, stat.defaultValue as string);
        }
      }
      result[gameName][stat.label] = value;
    }
  }

  return result;
};