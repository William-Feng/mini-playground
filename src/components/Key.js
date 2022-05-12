import React, { useContext } from "react";
import { AppContext } from "../App";

function Key({ val, special }) {
  const { onLetter, onEnter, onDelete } = useContext(AppContext);

  const updateGrid = () => {
    if (val === "ENTER") {
      onEnter();
    } else if (val === "DELETE") {
      onDelete();
    } else {
      onLetter(val);
    }
  };

  return (
    <div className="key" id={special && "bigKey"} onClick={updateGrid}>
      {val}
    </div>
  );
}

export default Key;
