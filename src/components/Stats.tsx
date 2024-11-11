"use client";

import React, {useEffect, useState} from "react";

interface Stats {
  aiWins: number;
  playerWins: number;
  draws: number;
}

const Stats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({aiWins: 0, playerWins: 0, draws: 0});

  // Charger les statistiques
  const fetchStats = async () => {
    const response = await fetch("/api/stats");
    const data = await response.json();
    setStats(data);
  };

  // Réinitialiser les statistiques
  const resetStats = async () => {
    await fetch("/api/stats", {method: "DELETE"});
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-[var(--color-player)] mb-4">Statistiques</h2>
      <p className="text-lg mb-2">Victoires IA : <span
        className="font-bold text-[var(--color-ai)]">{stats.aiWins}</span></p>
      <p className="text-lg mb-2">Victoires Joueur : <span
        className="font-bold text-[var(--color-player)]">{stats.playerWins}</span></p>
      <p className="text-lg mb-2">Matchs Nuls : <span
        className="font-bold text-[var(--color-draw)]">{stats.draws}</span></p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        onClick={resetStats}
      >
        Réinitialiser les Statistiques
      </button>
    </div>
  );
};

export default Stats;
