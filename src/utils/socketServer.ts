import {Server} from "socket.io";

let io: Server | null = null;

export const initializeSocket = (server: any) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log(`Nouvelle connexion : ${socket.id}`);

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Joueur a rejoint la salle : ${roomId}`);

        // Démarrer la partie en choisissant aléatoirement le premier joueur
        const firstPlayer = Math.random() < 0.5 ? "player" : "ai";
        io.to(roomId).emit("startGame", firstPlayer);
      });

      socket.on("move", (roomId, moveData) => {
        socket.to(roomId).emit("moveMade", moveData);
      });

      socket.on("resetGame", (roomId) => {
        io.to(roomId).emit("resetGame");
      });

      socket.on("disconnect", () => {
        console.log(`Déconnexion : ${socket.id}`);
      });
    });
  }
};
