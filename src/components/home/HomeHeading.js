import React, { useContext } from "react";
import "./HomeHeading.css";
import { FaMoon, FaSun } from "react-icons/fa";
import ReactSwitch from "react-switch";
import { ThemeContext } from "../../App";

function HomeHeading() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="banner">
      <h1 className="title">Mini Playground</h1>
      <div className="switch">
        <ReactSwitch
          onChange={toggleTheme}
          checked={theme === "dark"}
          onColor={"#027bff"}
          uncheckedIcon={<FaSun className="icon" />}
          checkedIcon={<FaMoon className="icon" />}
          height={40}
          width={70}
          handleDiameter={35}
        />
      </div>
    </div>
  );
}

export default HomeHeading;
