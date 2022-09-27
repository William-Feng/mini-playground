import React, { useContext } from "react";
import { ThemeContext } from "../App";
import "./Footer.css";

function Footer({ id }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={"footer" + (id ? " " + id : "")} id={theme}>
      Created by{" "}
      <a
        href="https://williamfeng.com.au/"
        target="_blank"
        className="author"
        rel="author"
      >
        William Feng
      </a>{" "}
      2022
    </div>
  );
}

export default Footer;
