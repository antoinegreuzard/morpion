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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Statistiques</h2>
      <p>Victoires IA : {stats.aiWins}</p>
      <p>Victoires Joueur : {stats.playerWins}</p>
      <p>Matchs Nuls : {stats.draws}</p>
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
