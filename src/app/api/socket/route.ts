import {Server as IOServer} from "socket.io";
import type {NextApiRequest} from "next";
import type {Server as HTTPServer} from "http";

let io: IOServer | undefined;

export async function GET(req: NextApiRequest) {
  if (!io) {
    console.log("Initialisation du serveur Socket.IO");

    const httpServer: HTTPServer = req.socket as unknown as HTTPServer;

    io = new IOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`Nouvelle connexion : ${socket.id}`);

      socket.on("playerReady", (playerName) => {
        console.log(`${playerName} est prêt.`);
        socket.broadcast.emit("opponentReady", playerName);
      });

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        io!.to(roomId).emit("roomReady");
      });

      socket.on("move", (roomId, moveData) => {
        io!.to(roomId).emit("moveMade", moveData);
      });

      socket.on("resetGame", (roomId) => {
        io!.to(roomId).emit("resetGame");
      });

      socket.on("disconnect", () => {
        console.log(`Déconnexion : ${socket.id}`);
      });
    });

    console.log("Socket.IO initialisé");
  }

  // Utiliser la nouvelle syntaxe de réponse
  return new Response("Socket.IO prêt", {status: 200});
}
