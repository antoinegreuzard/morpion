import React from "react";

export interface StatsData {
  aiwins: number;
  playerwins: number;
  draws: number;
}

interface StatsProps {
  stats: StatsData;
  isLoading: boolean;
  error: string | null;
}

const Stats: React.FC<StatsProps> = ({stats, isLoading, error}) => {
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
