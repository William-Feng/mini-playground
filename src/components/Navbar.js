import React, { useContext } from "react";
import "./Navbar.css";
import { ThemeContext } from "../App";
import { FaMoon, FaSun } from "react-icons/fa";
import ReactSwitch from "react-switch";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme" id={theme}>
      <div className="navbar">
        <h1 className="heading">Wordle</h1>
        <div className="switch">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"}
            onColor={"#027bff"}
            uncheckedIcon={<FaSun style={{ width: "30px", color: "yellow" }} />}
            checkedIcon={<FaMoon style={{ width: "30px", color: "yellow" }} />}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
