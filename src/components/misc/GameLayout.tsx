import { FC, ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface GameLayoutProps {
  heading: string;
  children: ReactNode;
  isWordle?: boolean;
}

const GameLayout: FC<GameLayoutProps> = ({ heading, children, isWordle }) => {
  return (
    <>
      <Navbar heading={heading} />
      {children}
      <Footer isWordle={isWordle} />
    </>
  );
};

export default GameLayout;