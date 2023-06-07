import React, { useContext } from "react";
import { ThemeContext } from "../../App";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { RiArrowGoBackFill } from "react-icons/ri";
import ReactSwitch from "react-switch";
import "./Navbar.css";

function Navbar({ heading }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme" id={theme}>
      <div className="navbar">
        <div className="arrow">
          <Link to="/">
            <RiArrowGoBackFill className="back" />
          </Link>
        </div>
        <h1 className="heading">{heading}</h1>
        <div className="switch">
          <ReactSwitch
            onChange={toggleTheme}
            checked={theme === "dark"}
            onColor={"#027bff"}
            uncheckedIcon={<FaSun className="icon" />}
            checkedIcon={<FaMoon className="icon" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;