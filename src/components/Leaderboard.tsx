"use client";

import React, {useEffect, useState} from "react";

interface LeaderboardEntry {
  player: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le leaderboard
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leaderboard");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du classement.");
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau :", error.message);
        setError("Impossible de récupérer le classement. Veuillez réessayer plus tard.");
      } else {
        console.error("Erreur inconnue :", error);
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-[var(--color-player)] mb-4">Classement</h2>

      {isLoading && <p className="text-lg">Chargement...</p>}

      {error && <p className="text-lg text-red-500">{error}</p>}

      {!isLoading && !error && (
        <ul>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <li key={index} className="mb-2 text-lg">
                {entry.player}: <span className="font-bold">{entry.score}</span>
              </li>
            ))
          ) : (
            <p className="text-lg">Aucun joueur trouvé.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
