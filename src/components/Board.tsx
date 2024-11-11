"use client";

import React, {useState, useEffect, useCallback} from "react";
import Square from "@/components/Square";
import Stats from "@/components/Stats";
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
  const [playerName, setPlayerName] = useState<string>("Joueur 1");
  const [opponentName, setOpponentName] = useState<string>(mode === "solo" ? "IA" : "Joueur 2");

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

    setIsXNext(mode !== "solo" ? !isXNext : false);
  };

  // Fonction pour que l'IA joue son coup
  const makeAIMove = useCallback(() => {
    if (mode !== "solo" || isXNext || winner) return;

    if (squares[4] === playerSymbol && squares.every((sq) => sq === null || sq === playerSymbol)) {
      const cornerMoves = [0, 2, 6, 8];
      const move = cornerMoves.find((i) => squares[i] === null);
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

  // Mettre à jour le leaderboard
  const updateLeaderboard = useCallback(async (currentWinner: string) => {
    const player = currentWinner === aiSymbol ? opponentName : playerName;
    const score = 1;

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({player, score}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour du leaderboard :", errorData.message);
        alert("Impossible de mettre à jour le leaderboard.");
      } else {
        console.log(`Le leaderboard a été mis à jour pour ${player}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau lors de la mise à jour du leaderboard :", error.message);
      } else {
        console.error("Erreur inconnue lors de la mise à jour du leaderboard :", error);
      }
      alert("Une erreur réseau est survenue lors de la mise à jour du leaderboard.");
    }
  }, [aiSymbol]);

  // Sauvegarder la partie
  const saveGame = async () => {
    try {
      const response = await fetch("/api/save-game", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({squares, isXNext, playerScore, aiScore, drawScore}),
      });

      if (!response.ok) {
        alert("La sauvegarde a échoué.");
      } else {
        alert("Partie sauvegardée avec succès !");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau :", error.message);
      }
      alert("Une erreur réseau est survenue lors de la sauvegarde.");
    }
  };

  // Charger la partie
  const loadGame = async () => {
    try {
      const response = await fetch("/api/load-game");

      if (response.ok) {
        const data = await response.json();

        // Vérifier si `squares` est une chaîne de caractères et le parser si nécessaire
        const loadedSquares = typeof data.squares === "string" ? JSON.parse(data.squares) : data.squares;

        if (!Array.isArray(loadedSquares)) {
          throw new Error("Données corrompues : `squares` n'est pas un tableau.");
        }

        setSquares(loadedSquares);

        setIsXNext(data.isxnext);
        setPlayerScore(Number(data.playerscore) || 0);
        setAiScore(Number(data.aiscore) || 0);
        setDrawScore(Number(data.drawscore) || 0);

        // Rétablir le mode et le joueur qui commence à partir des données sauvegardées
        setMode(data.mode ?? "solo");
        setStartingPlayer(data.startingPlayer ?? "player");
      } else {
        const errorData = await response.json();
        console.error("Erreur lors du chargement :", errorData.message);
        alert("Aucune partie sauvegardée trouvée.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau lors du chargement :", error.message);
      }
      alert("Une erreur réseau est survenue.");
    }
  };

  // Mettre à jour les statistiques avec gestion des erreurs
  const updateStats = useCallback(async (currentWinner: string) => {
    const body = {
      aiWins: currentWinner === aiSymbol ? 1 : 0,
      playerWins: currentWinner === playerSymbol ? 1 : 0,
      draws: currentWinner === "Draw" ? 1 : 0,
    };

    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour des statistiques :", errorData.message);
        alert("Impossible de mettre à jour les statistiques.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau lors de la mise à jour des statistiques :", error.message);
      } else {
        console.error("Erreur inconnue lors de la mise à jour des statistiques :", error);
      }
      alert("Une erreur réseau est survenue lors de la mise à jour des statistiques.");
    }
  }, [aiSymbol, playerSymbol]);

  useEffect(() => {
    if (mode === "solo" && startingPlayer === "ai" && squares.every((sq) => sq === null)) {
      makeAIMove();
    }
  }, [mode, startingPlayer, squares, makeAIMove]);

  useEffect(() => {
    if (mode === "solo") {
      setOpponentName("IA");
    } else if (mode === "multiplayer") {
      setOpponentName("Joueur 2");
    }
  }, [mode]);

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

      // Utiliser `currentWinner` au lieu de `winner`
      (async () => {
        await updateStats(currentWinner);
        await updateLeaderboard(currentWinner);
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

      {/* Champs pour les noms des joueurs */}
      {mode && !startingPlayer && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Entrez les noms des joueurs :</h2>
          <input
            type="text"
            placeholder="Nom du joueur 1"
            className="mb-2 p-2 border border-gray-300 rounded-lg"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          {mode === "multiplayer" && (
            <input
              type="text"
              placeholder="Nom du joueur 2"
              className="p-2 border border-gray-300 rounded-lg"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
            />
          )}
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
              {playerName} commence (X)
            </button>
            {mode === "solo" && (
              <button
                className="px-6 py-3 bg-red-500 text-white rounded-lg"
                onClick={() => initializeGame("ai")}
              >
                {opponentName} commence (X)
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
          <h1 className={`text-3xl font-bold mb-4 ${winner ? "animate-bounce text-green-500" : ""}`}>
            {winner ? `Gagnant : ${winner === playerSymbol ? playerName : opponentName}` : `Prochain coup : ${isXNext ? playerName : opponentName}`}
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
