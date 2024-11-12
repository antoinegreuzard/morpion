import type {NextConfig} from "next";
import {initializeSocket} from "@/utils/socketServer";
import http from "http";

const server = http.createServer();

// Initialiser le serveur Socket.IO
initializeSocket(server);

// Configuration Next.js
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ajoute le serveur HTTP pour Socket.IO dans la configuration runtime de Next.js
  serverRuntimeConfig: {
    server,
  },
};

export default nextConfig;
