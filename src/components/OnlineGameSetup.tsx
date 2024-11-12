"use client";

import React, {useState} from "react";

interface OnlineGameSetupProps {
  onJoinRoom: (roomId: string) => void;
}

const OnlineGameSetup: React.FC<OnlineGameSetupProps> = ({onJoinRoom}) => {
  const [roomId, setRoomId] = useState<string>("");

  // Fonction pour créer une nouvelle salle
  const handleCreateRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    onJoinRoom(newRoomId);
    alert(`Salle créée ! Partagez cet ID avec l'autre joueur : ${newRoomId}`);
  };

  // Fonction pour rejoindre une salle existante
  const handleJoinRoom = () => {
    if (!roomId || roomId.trim() === "") {
      alert("Veuillez entrer un ID de salle valide.");
      return;
    }
    onJoinRoom(roomId);
  }

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