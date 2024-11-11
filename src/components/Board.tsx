"use client";

import React, {useState, useEffect, useCallback} from "react";
import Square from "@/components/Square";
import Stats from "@/components/Stats"
import ScoreBoard from "@/components/ScoreBoard";
import {minimax, resetMemo} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";
import Leaderboard from "@/components/Leaderboard";
import GameControls from "@/components/GameControls";

const Board: React.FC = () => {
  const [squares, setSquares] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
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
    resetMemo();
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
    if (mode !== "solo" || isXNext || winner) return;

    // Ouverture spécifique pour "O" si "X" joue le centre
    if (squares[4] === playerSymbol && squares.every((square) => square === null || square === playerSymbol)) {
      const cornerMoves = [0, 2, 6, 8];
      const move = cornerMoves.find((index) => squares[index] === null);
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

  // Sauvegarder la partie
  const saveGame = async () => {
    try {
      const response = await fetch("/api/save-game", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({squares, isXNext, playerScore, aiScore, drawScore}),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("La sauvegarde a échoué.");
      } else {
        alert("Partie sauvegardée avec succès !");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Une erreur réseau est survenue lors de la sauvegarde.");
    }
  };

  // Charger la partie
  const loadGame = async () => {
    try {
      const response = await fetch("/api/load-game");

      if (response.ok) {
        const data = await response.json();

        setSquares(data.squares);
        setIsXNext(data.isXNext);
        setPlayerScore(data.playerScore);
        setAiScore(data.aiScore);
        setDrawScore(data.drawScore);

        // Rétablir le mode et le joueur qui commence à partir des données sauvegardées
        setMode(data.mode ?? "solo");
        setStartingPlayer(data.startingPlayer ?? "player");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors du chargement :", errorData.message);
        alert("Aucune partie sauvegardée trouvée.");
      }
    } catch (error) {
      console.error("Erreur réseau lors du chargement :", error);
      alert("Une erreur réseau est survenue.");
    }
  };

  // Mettre à jour les statistiques
  const updateStats = useCallback(async () => {
    const body = {
      aiWins: winner === aiSymbol ? 1 : 0,
      playerWins: winner === playerSymbol ? 1 : 0,
      draws: winner === "Draw" ? 1 : 0,
    };
    await fetch("/api/stats", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
  }, [winner, aiSymbol, playerSymbol]);

  useEffect(() => {
    if (mode === "solo" && startingPlayer === "ai" && squares.every((square) => square === null)) {
      makeAIMove();
    }
  }, [mode, startingPlayer, squares, makeAIMove]);

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

      // Mettre à jour les statistiques seulement après avoir défini le gagnant
      (async () => {
        await updateStats();
      })();
    }

    if (mode === "solo" && !isXNext && !winner) {
      makeAIMove();
    }
  }, [squares, isXNext, winner, makeAIMove, playerSymbol, aiSymbol, scoreUpdated, mode, updateStats]);

  // Réinitialiser le jeu
  const resetGame = () => {
    initializeGame(nextStartingPlayer);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Sélection du mode de jeu */}
      {!mode && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Choisissez le mode de jeu :</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              onClick={() => setMode("solo")}
            >
              Solo (IA)
            </button>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg"
              onClick={() => setMode("multiplayer")}
            >
              Multijoueur
            </button>
          </div>
        </div>
      )}

      {/* Sélection du joueur qui commence */}
      {mode && !startingPlayer && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Qui commence ?</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              onClick={() => initializeGame("player")}
            >
              Joueur commence (X)
            </button>
            {mode === "solo" && (
              <button
                className="px-6 py-3 bg-red-500 text-white rounded-lg"
                onClick={() => initializeGame("ai")}
              >
                IA commence (X)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contrôles et tableau de bord */}
      {startingPlayer && (
        <div className="flex flex-col items-center gap-6">
          <GameControls saveGame={saveGame} loadGame={loadGame}/>
          <div className="flex flex-wrap justify-center gap-8">
            <ScoreBoard playerScore={playerScore} aiScore={aiScore} drawScore={drawScore}/>
            <Leaderboard/>
            <Stats/>
          </div>
        </div>
      )}

      {/* Plateau de jeu */}
      {startingPlayer && (
        <div className="flex flex-col items-center gap-4">
          <h1
            className={`text-3xl font-bold mb-4 ${
              winner ? "animate-bounce text-green-500" : ""
            }`}
          >
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
          onClick={resetGame}
          className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg"
        >
          Rejouer
        </button>
      )}
    </div>
  );
};

export default Board;
