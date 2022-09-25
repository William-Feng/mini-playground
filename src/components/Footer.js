import React, { useContext } from "react";
import { ThemeContext } from "../App";
import "./Footer.css";

function Footer() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="footer" id={theme}>
      Created by <span className="author">William Feng</span> 2022
    </div>
  );
}

export default Footer;
