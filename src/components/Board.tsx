"use client";

import React, {useState, useEffect} from "react";
import Square from "@/components/Square";
import {minimax} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";

const Board: React.FC = () => {
  const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"X" | "O" | null>(null);

  // Initialiser le jeu
  const initializeGame = (firstPlayer: "X" | "O") => {
    setSquares(Array(9).fill(null));
    setIsXNext(firstPlayer === "X");
    setStartingPlayer(firstPlayer);
    setWinner(null);
  };

  const handleClick = (index: number) => {
    if (squares[index] || winner || startingPlayer === null) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  // Fonction pour que l'IA joue son coup
  const makeAIMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
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
    const currentWinner = checkWinner(squares);
    if (currentWinner) {
      setWinner(currentWinner);
      return;
    }

    if (!isXNext && startingPlayer === "O" && !winner) {
      makeAIMove();
    }
  }, [squares, isXNext, winner, startingPlayer]);

  return (
    <div>
      {/* Menu de sélection du joueur */}
      {!startingPlayer && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Choisissez qui commence :</h2>
          <button
            className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
            onClick={() => initializeGame("X")}
          >
            Joueur (X)
          </button>
          <button
            className="px-4 py-2 m-2 bg-red-500 text-white rounded"
            onClick={() => initializeGame("O")}
          >
            IA (O)
          </button>
        </div>
      )}

      {/* Plateau de jeu */}
      {startingPlayer && (
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {winner
              ? winner === "Draw"
                ? "Match nul !"
                : `Gagnant : ${winner}`
              : `Prochain coup : ${isXNext ? "X" : "O"}`}
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {squares.map((value, index) => (
              <Square key={index} value={value} onClick={() => handleClick(index)}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
