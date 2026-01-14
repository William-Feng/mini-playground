import React, { FC, useContext } from "react";
import { AppContext } from "../../App";
import "./Footer.css";

type FooterProps = {
  isHome?: boolean;
  isWordle?: boolean;
};

const Footer: FC<FooterProps> = ({ isHome, isWordle }) => {
  const { theme } = useContext(AppContext);
  const isPhoneView = window.innerWidth < 480;

  return (
    <div className={"footer " + (isWordle ? "wordle" : "")} id={theme}>
      Created by{" "}
      <a
        href="https://williamfeng.xyz/"
        target="_blank"
        className="author"
        rel="noopener noreferrer"
      >
        William Feng
      </a>{" "}
      {(!isPhoneView || isHome) && "2022"}
    </div>
  );
};

export default Footer;
