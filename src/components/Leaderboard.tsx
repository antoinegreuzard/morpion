"use client";

import React, {useEffect, useState} from "react";

interface LeaderboardEntry {
  player: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Charger le leaderboard
  const fetchLeaderboard = async () => {
    const response = await fetch("/api/leaderboard");
    const data = await response.json();
    setLeaderboard(data);
  };

  // Réinitialiser le leaderboard
  const resetLeaderboard = async () => {
    await fetch("/api/leaderboard", {method: "DELETE"});
    await fetchLeaderboard();
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-[var(--color-player)] mb-4">Classement</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index} className="mb-2 text-lg">
            {entry.player}: <span className="font-bold">{entry.score}</span>
          </li>
        ))}
      </ul>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        onClick={resetLeaderboard}
      >
        Réinitialiser le Classement
      </button>
    </div>
  );
};

export default Leaderboard;