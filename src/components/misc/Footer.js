import React, { useContext } from "react";
import { AppContext } from "../../App";
import "./Footer.css";

function Footer({ isHome, isWordle }) {
  const { theme } = useContext(AppContext);
  const isPhoneView = window.innerWidth < 480;

  return (
    <div className={"footer " + (isWordle ? "wordle" : "")} id={theme}>
      Created by{" "}
      <a
        href="https://williamfeng.com.au/"
        target="_blank"
        className="author"
        rel="noopener noreferrer"
      >
        William Feng
      </a>{" "}
      {(!isPhoneView || isHome) && "2022"}
    </div>
  );
}

export default Footer;
