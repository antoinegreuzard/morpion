"use client";

import React, {useState} from "react";

interface OnlineGameSetupProps {
  onJoinRoom: (roomId: string, playerName: string) => void;
}

const OnlineGameSetup: React.FC<OnlineGameSetupProps> = ({onJoinRoom}) => {
  const [roomId, setRoomId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fonction pour créer une nouvelle salle
  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setErrorMessage("Veuillez entrer votre nom.");
      return;
    }
    const newRoomId = `room-${Date.now()}`;
    onJoinRoom(newRoomId, playerName);
    setErrorMessage(null);
    setRoomId("");
  };

  // Fonction pour rejoindre une salle existante
  const handleJoinRoom = () => {
    if (!roomId.trim() || !playerName.trim()) {
      setErrorMessage("Veuillez entrer un ID de salle et votre nom.");
      return;
    }
    onJoinRoom(roomId.trim(), playerName);
    setErrorMessage(null);
    setRoomId("");
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Entrez votre nom"
        className="p-2 border border-gray-300 rounded-lg"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button
        className="px-6 py-3 bg-purple-500 text-white rounded-lg"
        onClick={handleCreateRoom}
      >
        Créer une Salle
      </button>
      <input
        type="text"
        placeholder="Entrez l'ID de la salle"
        className="p-2 border border-gray-300 rounded-lg"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        onClick={handleJoinRoom}
      >
        Rejoindre une Salle
      </button>
    </div>
  );
};

export default OnlineGameSetup;
