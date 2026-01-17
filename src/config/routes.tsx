import { ReactElement } from "react";
import Wordle from "../components/wordle/Wordle";
import TicTacToe from "../components/tic-tac-toe/TicTacToe";
import Memory from "../components/memory/Memory";
import Emoji from "../components/emoji/Emoji";
import Sliding from "../components/sliding/Sliding";
import Game2048 from "../components/2048/Game2048";
import Minesweeper from "../components/minesweeper/Minesweeper";
import LightsOut from "../components/lights-out/LightsOut";
import Othello from "../components/othello/Othello";

export interface GameRoute {
  path: string;
  heading: string;
  component: ReactElement;
  isWordle?: boolean;
}

export const gameRoutes: GameRoute[] = [
  {
    path: "/wordle",
    heading: "Wordle",
    component: <Wordle />,
    isWordle: true,
  },
  {
    path: "/tic-tac-toe",
    heading: "Tic Tac Toe",
    component: <TicTacToe />,
  },
  {
    path: "/memory",
    heading: "Colour Matching",
    component: <Memory />,
  },
  {
    path: "/emoji",
    heading: "Emoji Streak",
    component: <Emoji />,
  },
  {
    path: "/sliding",
    heading: "Sliding Puzzle",
    component: <Sliding />,
  },
  {
    path: "/2048",
    heading: "2048",
    component: <Game2048 />,
  },
  {
    path: "/minesweeper",
    heading: "Minesweeper",
    component: <Minesweeper />,
  },
  {
    path: "/lights-out",
    heading: "Lights Out",
    component: <LightsOut />,
  },
  {
    path: "/othello",
    heading: "Othello",
    component: <Othello />,
  },
];