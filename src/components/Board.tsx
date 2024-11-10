"use client";

import React, {useState} from "react";
import Square from "@/components/Square";

const Board: React.FC = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index: number) => {
    if (squares[index]) return;
    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {squares.map((value, index) => (
        <Square key={index} value={value} onClick={() => handleClick(index)}/>
      ))}
    </div>
  );
};

export default Board;
