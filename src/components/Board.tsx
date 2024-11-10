"use client";

import React, {useState, useEffect, useCallback} from "react";
import Square from "@/components/Square";
import ScoreBoard from "@/components/ScoreBoard";
import {minimax} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";

const Board: React.FC = () => {
  const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"player" | "ai" | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);
  const [scoreUpdated, setScoreUpdated] = useState(false);

  // Initialiser le jeu
  const initializeGame = (firstPlayer: "player" | "ai") => {
    setSquares(Array(9).fill(null));
    setIsXNext(firstPlayer === "player");
    setStartingPlayer(firstPlayer);
    setWinner(null);
    setScoreUpdated(false);

    // L'IA ne joue pas immédiatement ici
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

  // Appeler l'IA après que l'utilisateur a fait un choix ou cliqué sur "Rejouer"
  useEffect(() => {
    if (startingPlayer === "ai" && !winner && squares.every((square) => square === null)) {
      makeAIMove("X");
      setIsXNext(false);
    }
  }, [startingPlayer, squares, winner, makeAIMove]);

  // Mettre à jour le score et vérifier le tour de l'IA
  useEffect(() => {
    const currentWinner = checkWinner(squares);
    if (currentWinner && !scoreUpdated) {
      setWinner(currentWinner);
      setScoreUpdated(true);

      // Mettre à jour le score
      if (currentWinner === "X") {
        setPlayerScore((prev) => prev + 1);
      } else if (currentWinner === "O") {
        setAiScore((prev) => prev + 1);
      } else if (currentWinner === "Draw") {
        setDrawScore((prev) => prev + 1);
      }
      return;
    }

    // Si c'est le tour de l'IA
    if (!isXNext && !winner && startingPlayer !== null) {
      makeAIMove(isXNext ? "X" : "O");
    }
  }, [squares, isXNext, winner, startingPlayer, makeAIMove, scoreUpdated]);

  // Réinitialiser le jeu correctement
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setScoreUpdated(false);
  };

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

      {/* Affichage du score via le composant ScoreBoard */}
      <ScoreBoard playerScore={playerScore} aiScore={aiScore} drawScore={drawScore}/>

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

      {/* Bouton pour réinitialiser le jeu */}
      {winner && (
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          onClick={resetGame}
        >
          Rejouer
        </button>
      )}
    </div>
  );
};

export default Board;
