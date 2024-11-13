import React from "react";
import {FaUser, FaEquals} from "react-icons/fa";

interface ScoreBoardProps {
  playerScore: number;
  aiScore: number;
  drawScore: number;
  playerName: string;
  opponentName: string;
  mode: "solo" | "multiplayer" | "online";
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
                                                 playerScore,
                                                 aiScore,
                                                 drawScore,
                                                 playerName,
                                                 opponentName,
                                                 mode
                                               }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h3 className="text-2xl font-bold text-center text-[var(--color-player)] mb-4">Score</h3>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <FaUser className="text-[var(--color-player)] text-3xl"/>
          <p className="text-xl font-semibold">{playerName} (X) :</p>
          <span className="text-3xl font-bold">{playerScore}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaEquals className="text-[var(--color-draw)] text-3xl"/>
          <p className="text-xl font-semibold">Matchs nuls :</p>
          <span className="text-3xl font-bold">{drawScore}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaUser className="text-[var(--color-ai)] text-3xl"/>
          <p className="text-xl font-semibold">
            {mode === "solo" ? 'IA' : opponentName} (O) :
          </p>
          <span className="text-3xl font-bold">{aiScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
