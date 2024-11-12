import {Server} from "socket.io";
import http from "http";

let io: Server | null = null;

// Types des données et des événements Socket.IO
export interface MoveData {
  index: number;
  symbol: "X" | "O";
}

interface ServerToClientEvents {
  roomReady: () => void;
  startGame: (firstPlayer: "player" | "ai") => void;
  moveMade: (moveData: MoveData) => void;
  resetGame: () => void;
  error: (message: string) => void;
}

interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  move: (roomId: string, moveData: MoveData) => void;
  resetGame: (roomId: string) => void;
}

export const initializeSocket = (server: http.Server) => {
  if (!io) {
    io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
      cors: {
        origin: "*",
      },
    });

    const rooms: { [roomId: string]: Set<string> } = {};

    io!.on("connection", (socket) => {
      console.log(`Nouvelle connexion : ${socket.id}`);

      socket.on("joinRoom", (roomId) => {
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }

        rooms[roomId].add(socket.id);
        socket.join(roomId);
        console.log(`Joueur ${socket.id} a rejoint la salle : ${roomId}`);

        if (rooms[roomId].size === 2) {
          io!.to(roomId).emit("roomReady");
          const firstPlayer = Math.random() < 0.5 ? "player" : "ai";
          io!.to(roomId).emit("startGame", firstPlayer);
          console.log(`La partie commence dans la salle : ${roomId}`);
        } else if (rooms[roomId].size > 2) {
          socket.emit("error", "La salle est pleine !");
          socket.leave(roomId);
          rooms[roomId].delete(socket.id);
        }
      });

      socket.on("playerReady", (playerName) => {
        console.log(`Joueur prêt : ${playerName}`);
        socket.broadcast.emit("opponentReady", playerName);
      });

      socket.on("move", (roomId: string, moveData: MoveData) => {
        io!.to(roomId).emit("moveMade", moveData);
      });

      socket.on("resetGame", (roomId: string) => {
        io!.to(roomId).emit("resetGame");
        console.log(`Réinitialisation de la partie dans la salle : ${roomId}`);
      });

      socket.on("disconnect", () => {
        console.log(`Déconnexion : ${socket.id}`);

        for (const roomId in rooms) {
          if (rooms[roomId].has(socket.id)) {
            rooms[roomId].delete(socket.id);
            console.log(`Joueur ${socket.id} a quitté la salle : ${roomId}`);

            if (rooms[roomId].size === 0) {
              delete rooms[roomId];
              console.log(`La salle ${roomId} a été supprimée car elle est vide.`);
            }
          }
        }
      });
    });
  }
};
