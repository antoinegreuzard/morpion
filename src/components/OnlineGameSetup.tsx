"use client";

import React, {useState} from "react";

interface OnlineGameSetupProps {
  onJoinRoom: (roomId: string) => void;
}

const OnlineGameSetup: React.FC<OnlineGameSetupProps> = ({onJoinRoom}) => {
  const [roomId, setRoomId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fonction pour créer une nouvelle salle
  const handleCreateRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    onJoinRoom(newRoomId);
    setErrorMessage(null);
    setRoomId("");
  };

  // Fonction pour rejoindre une salle existante
  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setErrorMessage("Veuillez entrer un ID de salle valide.");
      return;
    }
    onJoinRoom(roomId.trim());
    setErrorMessage(null);
    setRoomId("");
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
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
