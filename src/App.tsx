import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Footer from "./components/misc/Footer";
import GameLayout from "./components/misc/GameLayout";
import { gameRoutes } from "./config/routes";
import { GameStat, getInitialGameStat } from "./config/gameStats";
import "./App.css";
import { Storage } from "./utils/Storage";

export type { GameStat } from "./config/gameStats";

export interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  gameStat: GameStat;
  setGameStat: Dispatch<SetStateAction<GameStat>>;
}

export const AppContext = createContext<AppContextType>({
  theme: "light",
  toggleTheme: () => {},
  gameStat: getInitialGameStat(false),
  setGameStat: () => {},
});

function App() {
  const [theme, setTheme] = useState<string>(
    () => Storage.getString("theme", "light")
  );

  useEffect(() => {
    Storage.setString("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const [gameStat, setGameStat] = useState<GameStat>(() => getInitialGameStat());

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, gameStat, setGameStat }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer isHome />
            </>
          }
        />
        {gameRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <GameLayout heading={route.heading} isWordle={route.isWordle}>
                {route.component}
              </GameLayout>
            }
          />
        ))}
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
