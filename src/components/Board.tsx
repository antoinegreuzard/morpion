"use client";

import React, {useState, useEffect, useCallback} from "react";
import Square from "@/components/Square";
import Stats, {StatsData} from "@/components/Stats";
import ScoreBoard from "@/components/ScoreBoard";
import {minimax, resetMemo} from "@/utils/minimax";
import {checkWinner} from "@/utils/checkWinner";
import Leaderboard, {LeaderboardEntry} from "@/components/Leaderboard";
import GameControls from "@/components/GameControls";
import OnlineGameSetup from "@/components/OnlineGameSetup";

const Board: React.FC = () => {
  const [squares, setSquares] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [mode, setMode] = useState<"solo" | "multiplayer" | "online" | null>(null);
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<StatsData>({aiwins: 0, playerwins: 0, draws: 0});
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRoomReady, setIsRoomReady] = useState(false);

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

    // Mettre à jour le leaderboard et les statistiques
    fetchLeaderboard();
    fetchStats();
  };

  const fetchLeaderboard = useCallback(async () => {
    setIsLeaderboardLoading(true);
    setLeaderboardError(null);

    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Erreur lors de la récupération du classement.");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLeaderboardError(error.message);
      }
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    setStatsError(null);

    try {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Erreur lors de la récupération des statistiques.");
      const data = await response.json();
      setStats(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatsError(error.message);
      }
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const joinRoom = (roomId: string) => {
    setRoomId(roomId);
  };

  const handleClick = (index: number) => {
    if (squares[index] || winner || startingPlayer === null) return;

    setSquares((prevSquares) => {
      const newSquares = prevSquares.slice();
      newSquares[index] = isXNext ? playerSymbol : aiSymbol;
      return newSquares;
    });

    setIsXNext((prevIsXNext) => (mode !== "solo" ? !prevIsXNext : false));
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
    // Utilisez "IA" comme nom si le mode est solo et l'IA gagne
    let player = "";

    // Déterminer le joueur à mettre à jour dans le leaderboard
    if (mode === "solo") {
      player = currentWinner === aiSymbol ? "IA" : playerName;
    } else if (mode === "multiplayer") {
      if (currentWinner === playerSymbol) {
        player = playerName; // Joueur 1 gagne
      } else if (currentWinner === aiSymbol) {
        player = opponentName; // Joueur 2 gagne
      } else {
        return; // Pas de mise à jour en cas de match nul en multijoueur
      }
    }

    const score = 1;

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({player, score}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }, [aiSymbol, mode, opponentName, playerName, playerSymbol]);

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
        alert(error.message);
      }
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
        alert(errorData.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
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
        alert(errorData.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }, [aiSymbol, playerSymbol]);

  useEffect(() => {
    if (mode === "solo" && startingPlayer === "ai" && squares.every((sq) => sq === null) && !winner) {
      makeAIMove();
    }
  }, [mode, startingPlayer, squares, makeAIMove, winner]);

  useEffect(() => {
    if (mode === "solo") {
      setOpponentName("IA");
    } else if (mode === "multiplayer" && opponentName.trim() === "") {
      setOpponentName("Joueur 2");
    }
  }, [mode, opponentName]);

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
        if (mode === "solo") {
          await updateStats(currentWinner);
        }
        await updateLeaderboard(currentWinner);
      })();
    }

    if (mode === "solo" && !isXNext && !winner) {
      makeAIMove();
    }
  }, [squares, isXNext, winner, makeAIMove, playerSymbol, aiSymbol, scoreUpdated, mode, updateStats, updateLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
  }, [fetchLeaderboard, fetchStats, startingPlayer]);

  // Réinitialiser le jeu
  const resetGame = () => {
    initializeGame(nextStartingPlayer);
  };

  useEffect(() => {
    if (mode === "online") {
      const handleRoomReady = () => {
        if (roomId) {
          setIsRoomReady(true);
          console.log(`Salle ${roomId} est prête.`);
        }
      };

      const handleError = (message: string) => {
        alert(message);
        setRoomId(null);
        setIsRoomReady(false);
      };

      const handleMoveMade = (moveData: any) => {
        const {index, symbol} = moveData;
        setSquares((prevSquares) => {
          const newSquares = prevSquares.slice();
          newSquares[index] = symbol;
          return newSquares;
        });
        setIsXNext(symbol !== playerSymbol);
      };
    }
  }, [mode, roomId, playerSymbol]);

  useEffect(() => {
    if (mode === "online") {
      const handleOpponentReady = (opponentName: string) => {
        setOpponentName(opponentName);
        console.log(`Votre adversaire, ${opponentName}, est prêt.`);
      };
    }
  }, [mode]);

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
              Multijoueur local
            </button>
            <button
              className="px-6 py-3 bg-purple-500 text-white rounded-lg"
              onClick={() => setMode("online")}
            >
              Multijoueur Online
            </button>
          </div>
        </div>
      )}

      {/* Configuration du jeu online */}
      {mode === "online" && !roomId && (
        <OnlineGameSetup onJoinRoom={joinRoom}/>
      )}

      {/* Configuration des joueurs quand la salle est prête */}
      {mode === "online" && isRoomReady && !startingPlayer && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Entrez votre nom :</h2>
          <input
            type="text"
            placeholder="Votre nom"
            className="mb-2 p-2 border border-gray-300 rounded-lg"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              if (playerName.trim()) {
                console.log(`Nom du joueur envoyé : ${playerName}`);
              } else {
                alert("Veuillez entrer un nom de joueur.");
              }
            }}
          >
            Commencer la partie
          </button>
        </div>
      )}

      {/* Champs pour les noms des joueurs */}
      {(mode === "solo" || mode === "multiplayer") && !startingPlayer && (
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
      {(mode === "solo" || mode === "multiplayer") && !startingPlayer && (
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
            <ScoreBoard
              playerScore={playerScore}
              aiScore={aiScore}
              drawScore={drawScore}
              playerName={playerName}
              opponentName={opponentName}
              mode={mode || "solo"}
            />
            <Leaderboard
              leaderboard={leaderboard}
              isLoading={isLeaderboardLoading}
              error={leaderboardError}
            />
            {mode === "solo" && (
              <Stats
                stats={stats}
                isLoading={isStatsLoading}
                error={statsError}
              />
            )}
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
