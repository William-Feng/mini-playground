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

export const newMaxStat = (
  game: string,
  statLabel: string,
  item: string,
  value: number,
  setGameStat: Dispatch<SetStateAction<GameStat>>
) => {
  let savedStatStr = localStorage.getItem(item);
  let savedStat = savedStatStr ? parseInt(savedStatStr) : -Infinity;
  let newValue = Math.max(savedStat, value);
  localStorage.setItem(item, newValue.toString());
  setGameStat((prevStats) => ({
    ...prevStats,
    [game]: {
      ...prevStats[game],
      [statLabel]: newValue,
    },
  }));
};

export const newMinTime = (
  game: string,
  statLabel: string,
  item: string,
  value: string,
  setGameStat: Dispatch<SetStateAction<GameStat>>
) => {
  const getShorterTime = (time1: string, time2: string) => {
    if (time2 === Infinity.toString()) return time1;

    const [min1, sec1] = time1.split(":").map(Number);
    const [min2, sec2] = time2.split(":").map(Number);

    const totalsecs1 = min1 * 60 + sec1;
    const totalsecs2 = min2 * 60 + sec2;

    return totalsecs1 <= totalsecs2 ? time1 : time2;
  };

  let savedStat = localStorage.getItem(item) ?? Infinity.toString();
  let newValue = getShorterTime(value, savedStat);
  localStorage.setItem(item, newValue.toString());
  setGameStat((prevStats) => ({
    ...prevStats,
    [game]: {
      ...prevStats[game],
      [statLabel]: newValue,
    },
  }));
};
