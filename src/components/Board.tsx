"use client";

import React, {useState, useEffect, useCallback} from "react";
import Square from "@/components/Square";
import {minimax} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";

const Board: React.FC = () => {
  const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"player" | "ai" | null>(null);

  // Initialiser le jeu
  const initializeGame = (firstPlayer: "player" | "ai") => {
    setSquares(Array(9).fill(null));
    setIsXNext(firstPlayer === "player");
    setStartingPlayer(firstPlayer);
    setWinner(null);

    // Si l'IA commence, elle joue immédiatement avec "X"
    if (firstPlayer === "ai") {
      makeAIMove("X");
      setIsXNext(false);
    }
  };

  const handleClick = (index: number) => {
    if (squares[index] || winner || startingPlayer === null) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  // Fonction pour que l'IA joue son coup
  const makeAIMove = useCallback((player: "X" | "O" = "O") => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        const newSquares = squares.slice();
        newSquares[i] = player;
        const score = minimax(newSquares, 0, player !== "O", -Infinity, Infinity);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      const newSquares = squares.slice();
      newSquares[move] = player;
      setSquares(newSquares);
      setIsXNext(player === "O");
    }
  }, [squares]);

  // Appeler l'IA quand c'est son tour
  useEffect(() => {
    const currentWinner = checkWinner(squares);
    if (currentWinner) {
      setWinner(currentWinner);
      return;
    }

    // Si c'est le tour de l'IA, elle joue avec "O"
    if (!isXNext && startingPlayer === "player" && !winner) {
      makeAIMove("O");
    }
  }, [squares, isXNext, winner, startingPlayer, makeAIMove]);

  return (
    <div>
      {/* Menu de sélection du joueur */}
      {!startingPlayer && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Choisissez qui commence :</h2>
          <button
            className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
            onClick={() => initializeGame("player")}
          >
            Joueur commence (X)
          </button>
          <button
            className="px-4 py-2 m-2 bg-red-500 text-white rounded"
            onClick={() => initializeGame("ai")}
          >
            IA commence (X)
          </button>
        </div>
      )}

      {/* Plateau de jeu */}
      {startingPlayer && (
        <div>
          <h1 className={`text-3xl font-bold mb-4 ${winner ? "animate-bounce text-green-500" : ""}`}>
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
