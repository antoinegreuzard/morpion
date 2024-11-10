"use client";

import React from "react";
import {FaUser, FaRobot, FaEquals} from "react-icons/fa";

interface ScoreBoardProps {
  playerScore: number;
  aiScore: number;
  drawScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({playerScore, aiScore, drawScore}) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-sm mx-auto">
      <h3 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">Score</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Score du joueur */}
        <div className="flex items-center gap-2">
          <FaUser className="text-blue-500 text-3xl"/>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Joueur (X) : </p>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{playerScore}</span>
        </div>

        {/* Score des matchs nuls */}
        <div className="flex items-center gap-2">
          <FaEquals className="text-gray-500 text-3xl"/>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Matchs nuls : </p>
          <span className="text-3xl font-bold text-gray-600 dark:text-gray-400">{drawScore}</span>
        </div>

        {/* Score de l'IA */}
        <div className="flex items-center gap-2">
          <FaRobot className="text-red-500 text-3xl"/>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">IA (O) : </p>
          <span className="text-3xl font-bold text-red-600 dark:text-red-400">{aiScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
