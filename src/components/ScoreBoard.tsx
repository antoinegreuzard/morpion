"use client";

import React from "react";

interface ScoreBoardProps {
  playerScore: number;
  aiScore: number;
  drawScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({playerScore, aiScore, drawScore}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold">Score :</h3>
      <p>Joueur (X) : {playerScore}</p>
      <p>IA (O) : {aiScore}</p>
      <p>Matchs nuls : {drawScore}</p>
    </div>
  );
};

export default ScoreBoard;
