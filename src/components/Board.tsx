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
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isOpponentJoined, setIsOpponentJoined] = useState(false);
  const [opponentSymbol, setOpponentSymbol] = useState<"X" | "O">("O");

  const {data: gameState, mutate: refreshGameState} = useSWR(
    roomId ? `/api/game/${roomId}` : null,
    fetcher,
    {refreshInterval: 1000}
  );

  // Initialiser le jeu
  const initializeGame = async (firstPlayer: "player" | "ai") => {
    resetMemo();
    setSquares(Array(9).fill(null));
    setIsXNext(firstPlayer === "player");
    setStartingPlayer(firstPlayer);
    setWinner(null);
    setScoreUpdated(false);

    // Définir les symboles en fonction du joueur qui commence
    if (mode === "online") {
      // Ne redéfinir les symboles que s'ils ne sont pas déjà définis
      if (playerSymbol !== "X" && playerSymbol !== "O") {
        if (isCreator) {
          setPlayerSymbol("X");
          setAiSymbol("O");
        } else {
          setPlayerSymbol("O");
          setAiSymbol("X");
        }
      }
    } else {
      // Modes "solo" et "multiplayer"
      if (firstPlayer === "player") {
        setPlayerSymbol("X");
        setAiSymbol("O");
      } else {
        setPlayerSymbol("O");
        setAiSymbol("X");
      }
    }

    // Si mode online, synchroniser l'état initial avec l'API
    if (mode === "online" && roomId) {
      try {
        await fetch(`/api/game/${roomId}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            squares: Array(9).fill(null),
            isXNext: nextStartingPlayer === "player",
            winner: null,
            startingPlayer: firstPlayer,
          }),
        });
        await refreshGameState();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état du jeu :", error);
      }
    }

    // Mettre à jour le leaderboard et les statistiques
    await fetchLeaderboard();
    await fetchStats();
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

  const joinRoom = async (roomId: string, playerName: string) => {
    setRoomId(roomId);
    setPlayerName(playerName);

    try {
      const response = await fetch(`/api/game/${roomId}`);
      const data = await response.json();

      if (!data.playerName) {
        // Créateur de la room
        await fetch(`/api/game/${roomId}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            squares: Array(9).fill(null),
            isXNext: true,
            playerName,
            opponentName: null,
            winner: null,
            startingPlayer,
            playerSymbol: "X",
            opponentSymbol: "O",
          }),
        });
        if (data.player_symbol && data.opponent_symbol) {
          setPlayerSymbol(data.player_symbol);
          setAiSymbol(data.opponent_symbol);
        } else {
          console.error("Les symboles des joueurs ne sont pas définis :", data);
        }
        setIsCreator(true);
        setIsWaitingForOpponent(true);
        setIsRoomReady(false);
        setPlayerSymbol("O");
        setOpponentSymbol("X");
      } else if (!data.opponentName && data.playerName !== playerName) {
        // Joueur rejoignant la room
        await fetch(`/api/game/${roomId}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            opponentName: playerName,
            playerSymbol: "X", // Créateur est "X"
            opponentSymbol: "O", // Rejoignant est "O"
          }),
        });
        setPlayerSymbol("O");
        setAiSymbol("X");
        setIsOpponentJoined(true);
        setIsRoomReady(true);
        setIsWaitingForOpponent(false);
        setPlayerSymbol("X");
        setOpponentSymbol("O");
      }

      await refreshGameState();
    } catch (error) {
      console.error("Erreur lors de la connexion à la salle :", error);
    }
  };

  const handleClick = async (index: number) => {
    // Empêche de jouer si la case est déjà occupée, s'il y a un gagnant ou si le jeu n'est pas initialisé
    if (squares[index] || winner || startingPlayer === null) return;

    // Vérifie si c'est le tour du joueur actuel
    if (mode === "online" && gameState) {
      console.log(gameState)
      const isPlayerTurn = (isXNext && playerSymbol === "X" && isCreator) ||
        (!isXNext && playerSymbol === "O" && isCreator) ||
        (isXNext && opponentSymbol === "X" && !isCreator) ||
        (!isXNext && opponentSymbol === "O" && !isCreator);

      if (!isPlayerTurn) {
        console.log("Ce n'est pas ton tour !");
        return;
      }
    }

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? playerSymbol : aiSymbol;
    const nextIsX = newSquares.filter(Boolean).length % 2 === 0;
    const currentWinner = checkWinner(newSquares);

    // Mise à jour locale
    setSquares(newSquares);
    setIsXNext(nextIsX);

    // Si mode online, mettre à jour l'API
    if (mode === "online" && roomId) {
      try {
        await fetch(`/api/game/${roomId}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            squares: newSquares,
            isXNext: nextIsX,
            winner: currentWinner || null,
            startingPlayer: startingPlayer,
            player_symbol: playerSymbol,
            opponent_symbol: aiSymbol,
          }),
        });
        await refreshGameState();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état du jeu :", error);
      }
    }

    // Vérifier le gagnant et mettre à jour le leaderboard
    if (currentWinner) {
      setWinner(currentWinner);
      await updateLeaderboard(currentWinner);
      await updateStats(currentWinner);
    }
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
    if (mode === "online" && roomId && isWaitingForOpponent) {
      const checkOpponentJoined = async () => {
        try {
          const response = await fetch(`/api/game/${roomId}`);
          const data = await response.json();

          if (data.opponentName && data.opponentName !== playerName) {
            setOpponentName(data.opponentName);
            setIsRoomReady(true);
            setIsWaitingForOpponent(false);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification de l'adversaire :", error);
        }
      };

      const intervalId = setInterval(checkOpponentJoined, 2000);
      return () => clearInterval(intervalId);
    }
  }, [mode, roomId, isWaitingForOpponent, playerName]);

  // Réinitialiser le jeu
  const resetGame = async () => {
    await initializeGame(nextStartingPlayer);

    if (mode === "online" && roomId) {
      try {
        await fetch(`/api/game/${roomId}`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            squares: Array(9).fill(null),
            isXNext: nextStartingPlayer === "player",
            winner: null,
          }),
        });

        await refreshGameState();
      } catch (error) {
        console.error("Erreur lors de la réinitialisation du jeu en ligne :", error);
      }
    }
  };

  useEffect(() => {
    if (mode === "online" && gameState) {
      setSquares(gameState.squares);
      setIsXNext(gameState.isXNext);
      setWinner(gameState.winner);
      setPlayerName(gameState.playerName || "Joueur 1");
      setOpponentName(gameState.opponentName || "Joueur 2");
      setPlayerSymbol(gameState.player_symbol || "X");
      setAiSymbol(gameState.opponent_symbol || "O");
    }
  }, [mode, gameState]);

  useEffect(() => {
    if (mode === "online" && gameState && gameState.startingPlayer && !startingPlayer) {
      setStartingPlayer(gameState.startingPlayer);
      setIsXNext(gameState.startingPlayer === "player");
      refreshGameState();
    }
  }, [mode, gameState, startingPlayer, refreshGameState]);

  useEffect(() => {
    if (mode === "online" && roomId && gameState) {
      // Si l'adversaire a rejoint (opponentName est défini) et que ce n'est pas encore marqué localement
      if (gameState.opponentName && !isOpponentJoined) {
        setIsOpponentJoined(true);
        setIsRoomReady(true);
        setIsWaitingForOpponent(false);
      }

      // Si le créateur attendait l'adversaire et que celui-ci est arrivé
      if (isCreator && isWaitingForOpponent && gameState.opponentName) {
        setIsWaitingForOpponent(false);
        setIsRoomReady(true);
      }
    }
  }, [mode, roomId, gameState, isOpponentJoined, isCreator, isWaitingForOpponent]);


  useEffect(() => {
    if (mode === "online" && roomId && isRoomReady && playerName.trim()) {
      (async () => {
        await refreshGameState();
        const response = await fetch(`/api/game/${roomId}`);
        const data = await response.json();
        const opponent = data.opponentName;
        setOpponentName(opponent || "Adversaire");
      })();
    }
  }, [mode, roomId, isRoomReady, playerName, refreshGameState]);
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
      {mode === "online" && !roomId && !startingPlayer && !isWaitingForOpponent && (
        <OnlineGameSetup onJoinRoom={(roomId, playerName) => joinRoom(roomId, playerName)}/>
      )}

      {/* Configuration des joueurs pour tous les modes */}
      {(mode === "solo" || mode === "multiplayer") && !startingPlayer && !isWaitingForOpponent && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Entrez les noms des joueurs :</h2>
          <input
            type="text"
            placeholder="Nom du joueur 1"
            className="mb-2 p-2 border border-gray-300 rounded-lg"
            value={playerName || "Nom du joueur"}
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
      {(mode === "solo" || mode === "multiplayer") && !startingPlayer && playerName.trim() && (
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Qui commence ?</h2>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              onClick={() => initializeGame("player")}
            >
              {playerName} commence (X)
            </button>
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-lg"
              onClick={() => initializeGame("ai")}
            >
              IA commence (X)
            </button>
          </div>
        </div>
      )}

      {isCreator && isOpponentJoined && !startingPlayer && (
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
            onClick={() => initializeGame("player")}
          >
            {playerName} commence (X)
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg"
            onClick={() => initializeGame("ai")}
          >
            {opponentName} commence (X)
          </button>
        </div>
      )}


      {/* Affichage des messages d'attente */}
      {mode === "online" && roomId && !startingPlayer && (
        <div className="flex flex-col items-center gap-4">
          {isCreator && isWaitingForOpponent && (
            <div>
              <h2 className="text-2xl font-bold mb-4">En attente de l&#39;adversaire...</h2>
              <p>Partagez l&#39;ID de la salle : <span className="font-bold">{roomId}</span></p>
            </div>
          )}
          {!isCreator && isRoomReady && (
            <h2 className="text-2xl font-bold mb-4">En attente du créateur pour commencer la partie...</h2>
          )}
        </div>
      )}


      {/* Contrôles et tableau de bord */}
      {startingPlayer && (
        <div className="flex flex-col items-center gap-6">
          {mode !== "online" && (
            <GameControls saveGame={saveGame} loadGame={loadGame}/>
          )}
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
      {startingPlayer && (mode !== "online" || isRoomReady) && (
        <div className="flex flex-col items-center gap-4">
          <h1 className={`text-3xl font-bold mb-4 ${winner ? "animate-bounce text-green-500" : ""}`}>
            {winner
              ? `Gagnant : ${winner === playerSymbol ? playerName : opponentName}`
              : `Prochain coup : ${isXNext ? (playerSymbol === "X" ? playerName : opponentName) : (playerSymbol === "O" ? playerName : opponentName)}`}
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
