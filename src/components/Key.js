import React from "react";

function Key({ val, special }) {
  return (
    <div className="key" id={special && "bigKey"}>
      {val}
    </div>
  );
}

export default Key;
