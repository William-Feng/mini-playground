import { Storage } from "../utils/Storage";

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
    { key: "wordle-guessed", label: "Words Guessed", defaultValue: 0, type: "number" },
    { key: "wordle-missed", label: "Words Missed", defaultValue: 0, type: "number" },
  ],
  "Tic Tac Toe": [
    { key: "tictactoe-drew", label: "Rounds Drew (1P)", defaultValue: 0, type: "number" },
    { key: "tictactoe-lost", label: "Rounds Lost (1P)", defaultValue: 0, type: "number" },
    { key: "tictactoe-xWon", label: "Player X Won (2P)", defaultValue: 0, type: "number" },
    { key: "tictactoe-oWon", label: "Player O Won (2P)", defaultValue: 0, type: "number" },
    { key: "tictactoe-drew2P", label: "Players Drew (2P)", defaultValue: 0, type: "number" },
  ],
  "Colour Matching": [
    { key: "colour-minTurns-easy", label: "Minimum Turns (Easy)", defaultValue: "N/A", type: "string" },
    { key: "colour-minTurns-medium", label: "Minimum Turns (Medium)", defaultValue: "N/A", type: "string" },
    { key: "colour-minTurns-hard", label: "Minimum Turns (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "Emoji Streak": [
    { key: "emoji-maxStreak-easy", label: "Maximum Streak (Easy)", defaultValue: 0, type: "number" },
    { key: "emoji-maxStreak-medium", label: "Maximum Streak (Medium)", defaultValue: 0, type: "number" },
    { key: "emoji-maxStreak-hard", label: "Maximum Streak (Hard)", defaultValue: 0, type: "number" },
  ],
  "Sliding Puzzle": [
    { key: "sliding-minMoves-easy", label: "Minimum Moves (Easy)", defaultValue: "N/A", type: "string" },
    { key: "sliding-minMoves-hard", label: "Minimum Moves (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "2048": [
    { key: "2048-maxScore", label: "Maximum Score", defaultValue: 0, type: "number" },
  ],
  Minesweeper: [
    { key: "minesweeper-won", label: "Games Won", defaultValue: 0, type: "number" },
    { key: "minesweeper-lost", label: "Games Lost", defaultValue: 0, type: "number" },
    { key: "minesweeper-minTime-easy", label: "Minimum Time (Easy)", defaultValue: "N/A", type: "string" },
    { key: "minesweeper-minTime-medium", label: "Minimum Time (Medium)", defaultValue: "N/A", type: "string" },
    { key: "minesweeper-minTime-hard", label: "Minimum Time (Hard)", defaultValue: "N/A", type: "string" },
  ],
  "Lights Out": [
    { key: "lights-minTurns-easy", label: "Minimum Turns (Easy)", defaultValue: "N/A", type: "string" },
    { key: "lights-minTurns-medium", label: "Minimum Turns (Medium)", defaultValue: "N/A", type: "string" },
    { key: "lights-minTurns-hard", label: "Minimum Turns (Hard)", defaultValue: "N/A", type: "string" },
  ],
  Othello: [
    { key: "othello-won", label: "Games Won (1P)", defaultValue: 0, type: "number" },
    { key: "othello-lost", label: "Games Lost (1P)", defaultValue: 0, type: "number" },
    { key: "othello-drew", label: "Games Drew (1P)", defaultValue: 0, type: "number" },
    { key: "othello-lightWon", label: "Light Won (2P)", defaultValue: 0, type: "number" },
    { key: "othello-darkWon", label: "Dark Won (2P)", defaultValue: 0, type: "number" },
    { key: "othello-drew2P", label: "Players Drew (2P)", defaultValue: 0, type: "number" },
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