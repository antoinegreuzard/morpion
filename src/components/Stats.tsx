"use client";

import React, {useEffect, useState} from "react";

interface Stats {
  aiwins: number;
  playerwins: number;
  draws: number;
}

const Stats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({aiwins: 0, playerwins: 0, draws: 0});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les statistiques
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stats");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statistiques.");
      }

      const data = await response.json();
      setStats(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur réseau :", error.message);
        setError("Impossible de récupérer les statistiques. Veuillez réessayer plus tard.");
      } else {
        console.error("Erreur inconnue :", error);
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-[var(--color-player)] mb-4">Statistiques</h2>

      {isLoading && <p className="text-lg">Chargement...</p>}

      {error && <p className="text-lg text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          <p className="text-lg mb-2">
            Victoires IA : <span className="font-bold text-[var(--color-ai)]">{stats.aiwins}</span>
          </p>
          <p className="text-lg mb-2">
            Victoires Joueur : <span className="font-bold text-[var(--color-player)]">{stats.playerwins}</span>
          </p>
          <p className="text-lg mb-2">
            Matchs Nuls : <span className="font-bold text-[var(--color-draw)]">{stats.draws}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default Stats;
