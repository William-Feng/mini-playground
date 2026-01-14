import { Dispatch, SetStateAction } from "react";
import { GameStat } from "../App";
import { Storage } from "./Storage";

export const incrementStat = (
  game: string,
  statLabel: string,
  item: string,
  setGameStat: Dispatch<SetStateAction<GameStat>>
) => {
  const savedStat = Storage.getNumber(item);
  Storage.setNumber(item, savedStat + 1);
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
  const savedStatStr = Storage.getString(item);
  const savedStat = savedStatStr && savedStatStr !== "N/A" ? parseInt(savedStatStr) : Infinity;
  const newValue = Math.min(savedStat, value);
  Storage.setNumber(item, newValue);
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
  const savedStatStr = Storage.getString(item);
  const savedStat = savedStatStr ? parseInt(savedStatStr) : -Infinity;
  const newValue = Math.max(savedStat, value);
  Storage.setNumber(item, newValue);
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
  const getShorterTime = (time1: string, time2: string): string => {
    if (time2 === Infinity.toString() || time2 === "N/A") return time1;

    const [min1, sec1] = time1.split(":").map(Number);
    const [min2, sec2] = time2.split(":").map(Number);

    const totalsecs1 = min1 * 60 + sec1;
    const totalsecs2 = min2 * 60 + sec2;

    return totalsecs1 <= totalsecs2 ? time1 : time2;
  };

  const savedStat = Storage.getString(item, "N/A");
  const newValue = getShorterTime(value, savedStat);
  Storage.setString(item, newValue);
  setGameStat((prevStats) => ({
    ...prevStats,
    [game]: {
      ...prevStats[game],
      [statLabel]: newValue,
    },
  }));
};
