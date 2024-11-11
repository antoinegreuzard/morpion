import React from "react";

export interface LeaderboardEntry {
  player: string;
  score: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({leaderboard, isLoading, error}) => {
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
