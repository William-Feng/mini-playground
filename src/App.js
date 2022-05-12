import { createContext, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

export const AppContext = createContext();

function App() {
  const gridDefault = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  const [grid, setGrid] = useState(gridDefault);

  return (
    <div className="App">
      <h1>Wordle</h1>
      <AppContext.Provider value={{ grid, setGrid }}>
        <Grid />
        <Keyboard />
      </AppContext.Provider>
    </div>
  );
}

export default App;
