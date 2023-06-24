import React, { useContext } from "react";
import "./HomeHeading.css";
import { FaMoon, FaSun } from "react-icons/fa";
import ReactSwitch from "react-switch";
import { AppContext } from "../../App";

function HomeHeading() {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <div className="banner">
      <h1 className="title">Mini Playground</h1>
      {window.innerWidth > 1000 ? (
        <div className="switch">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"}
            onColor={"#027bff"}
            uncheckedIcon={<FaSun className="large-icon" />}
            checkedIcon={<FaMoon className="large-icon" />}
            height={40}
            width={70}
            handleDiameter={35}
          />
        </div>
      ) : (
        <div className="switch">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"}
            onColor={"#027bff"}
            uncheckedIcon={<FaSun className="icon" />}
            checkedIcon={<FaMoon className="icon" />}
          />
        </div>
      )}
    </div>
  );
}

export default HomeHeading;
