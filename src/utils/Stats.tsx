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
