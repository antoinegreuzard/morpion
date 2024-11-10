"use client";

import React, {useState, useEffect} from "react";
import Square from "@/components/Square";
import {minimax} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";

const Board: React.FC = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = checkWinner(squares);

  const handleClick = (index: number) => {
    if (squares[index] || winner) return;

    const newSquares = squares.slice();
    newSquares[index] = "X";
    setSquares(newSquares);
    setIsXNext(false);
  };

  // Fonction pour que l'IA joue son coup
  const makeAIMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = squares.slice();
        newSquares[i] = "O";
        const score = minimax(newSquares, 0, false);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      const newSquares = squares.slice();
      newSquares[move] = "O";
      setSquares(newSquares);
      setIsXNext(true);
    }
  };

  // Appeler l'IA quand c'est son tour
  useEffect(() => {
    if (!isXNext && !winner) {
      makeAIMove();
    }
  }, [isXNext, winner]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {winner ? (winner === "Draw" ? "Match nul !" : `Gagnant : ${winner}`) : `Prochain coup : ${isXNext ? "X" : "O"}`}
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {squares.map((value, index) => (
          <Square key={index} value={value} onClick={() => handleClick(index)}/>
        ))}
      </div>
    </div>
  );
};

export default Board;
