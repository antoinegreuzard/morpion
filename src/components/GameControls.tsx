"use client";

import React from "react";

interface GameControlsProps {
  saveGame: () => void;
  loadGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({saveGame, loadGame}) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={saveGame}
      >
        Sauvegarder la Partie
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={loadGame}
      >
        Charger la Partie
      </button>
    </div>
  );
};

export default GameControls;
