import { Dispatch, SetStateAction } from "react";
import { GameStat } from "../App";

export const incrementStat = (
  game: string,
  statLabel: string,
  item: string,
  setGameStat: Dispatch<SetStateAction<GameStat>>
) => {
  let savedStat = parseInt(localStorage.getItem(item) || "0");
  localStorage.setItem(item, (savedStat + 1).toString());
  setGameStat((prevStats) => ({
    ...prevStats,
    [game]: {
      ...prevStats[game],
      [statLabel]: savedStat + 1,
    },
  }));
};

export const newMinStat = (
  game: string,
  statLabel: string,
  item: string,
  value: number,
  setGameStat: Dispatch<SetStateAction<GameStat>>
) => {
  let savedStatStr = localStorage.getItem(item);
  let savedStat = savedStatStr ? parseInt(savedStatStr) : Infinity;
  let newValue = Math.min(savedStat, value);
  localStorage.setItem(item, newValue.toString());
  setGameStat((prevStats) => ({
    ...prevStats,
    [game]: {
      ...prevStats[game],
      [statLabel]: newValue,
    },
  }));
};
