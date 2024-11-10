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
  const [mode, setMode] = useState<"solo" | "multiplayer" | null>(null);
  const [startingPlayer, setStartingPlayer] = useState<"player" | "ai" | null>(null);
  const [nextStartingPlayer, setNextStartingPlayer] = useState<"player" | "ai">("player");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
  const [aiSymbol, setAiSymbol] = useState<"X" | "O">("O");
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

    // Définir les symboles en fonction du joueur qui commence
    if (firstPlayer === "player") {
      setPlayerSymbol("X");
      setAiSymbol("O");
    } else {
      setPlayerSymbol("O");
      setAiSymbol("X");
    }
  };

  const handleClick = (index: number) => {
    if (squares[index] || winner || startingPlayer === null) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? playerSymbol : aiSymbol;
    setSquares(newSquares);

    if (mode === "solo") {
      setIsXNext(false);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Fonction pour que l'IA joue son coup
  const makeAIMove = useCallback(() => {
    if (isXNext || winner || mode !== "solo") return;

    // Si c'est le premier coup de l'IA, jouer au centre ou dans un coin
    if (squares.every((square) => square === null)) {
      const openingMoves = [4, 0, 2, 6, 8];
      const move = openingMoves.find((index) => squares[index] === null);
      if (move !== undefined) {
        const newSquares = squares.slice();
        newSquares[move] = aiSymbol;
        setSquares(newSquares);
        setIsXNext(true);
        return;
      }
    }

    // Utiliser minimax pour déterminer le meilleur coup
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        const newSquares = squares.slice();
        newSquares[i] = aiSymbol;
        const score = minimax(newSquares, 0, aiSymbol !== "O", -Infinity, Infinity, aiSymbol, playerSymbol);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      const newSquares = squares.slice();
      newSquares[move] = aiSymbol;
      setSquares(newSquares);
      setIsXNext(true);
    }
  }, [squares, aiSymbol, playerSymbol, isXNext, winner, mode]);

  // Appeler l'IA après que l'utilisateur a fait un choix ou cliqué sur "Rejouer"
  useEffect(() => {
    if (mode === "solo" && startingPlayer === "ai" && squares.every((square) => square === null)) {
      makeAIMove();
    }
  }, [mode, startingPlayer, squares, makeAIMove]);

  // Mettre à jour le score et vérifier le tour de l'IA
  useEffect(() => {
    const currentWinner = checkWinner(squares);
    if (currentWinner && !scoreUpdated) {
      setWinner(currentWinner);
      setScoreUpdated(true);

      if (currentWinner === playerSymbol) {
        setPlayerScore((prev) => prev + 1);
      } else if (currentWinner === aiSymbol) {
        setAiScore((prev) => prev + 1);
      } else if (currentWinner === "Draw") {
        setDrawScore((prev) => prev + 1);
      }

      setNextStartingPlayer((prev) => (prev === "player" ? "ai" : "player"));
      return;
    }

    if (mode === "solo" && !isXNext && !winner) {
      makeAIMove();
    }
  }, [squares, isXNext, winner, makeAIMove, playerSymbol, aiSymbol, scoreUpdated, mode]);

  // Réinitialiser le jeu
  const resetGame = () => {
    initializeGame(nextStartingPlayer);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Sélection du mode */}
      {!mode && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Choisissez le mode de jeu :</h2>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 m-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              onClick={() => setMode("solo")}
            >
              Solo (IA)
            </button>
            <button
              className="px-4 py-2 m-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
              onClick={() => setMode("multiplayer")}
            >
              Multijoueur
            </button>
          </div>
        </div>
      )}

      {/* Menu de sélection du joueur */}
      {mode && !startingPlayer && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">Qui commence ?</h2>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 m-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              onClick={() => initializeGame("player")}
            >
              Joueur commence (X)
            </button>
            {mode === "solo" && (
              <button
                className="px-4 py-2 m-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
                onClick={() => initializeGame("ai")}
              >
                IA commence (X)
              </button>
            )}
          </div>
        </div>
      )}

      {/* ScoreBoard */}
      <div className="w-full max-w-md mb-8">
        <ScoreBoard playerScore={playerScore} aiScore={aiScore} drawScore={drawScore}/>
      </div>

      {/* Plateau de jeu */}
      {startingPlayer && (
        <div>
          <h1 className={`text-3xl font-bold mb-6 ${winner ? "animate-bounce text-green-500" : ""}`}>
            {winner ? `Gagnant : ${winner}` : `Prochain coup : ${isXNext ? playerSymbol : aiSymbol}`}
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {squares.map((value, index) => (
              <Square key={index} value={value} onClick={() => handleClick(index)}/>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Rejouer */}
      {winner && (
        <button
          className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-800"
          onClick={resetGame}
        >
          Rejouer
        </button>
      )}
    </div>
  );
};

export default Board;
