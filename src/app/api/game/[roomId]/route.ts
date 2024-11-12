// src/app/api/game/[roomId]/route.ts
import {NextRequest, NextResponse} from "next/server";

type GameState = {
  squares: ("X" | "O" | null)[];
  isXNext: boolean;
  playerName?: string;
  opponentName?: string;
  winner?: string;
};

const gameStates: Record<string, GameState> = {};

// GET: Récupérer l'état du jeu
export async function GET(req: NextRequest, {params}: { params: { roomId: string } }) {
  const {roomId} = params;
  const gameState = gameStates[roomId] || {squares: Array(9).fill(null), isXNext: true};
  return NextResponse.json(gameState);
}

// POST: Mettre à jour l'état du jeu
export async function POST(req: NextRequest, {params}: { params: { roomId: string } }) {
  const {roomId} = params;
  const body = await req.json();
  const {squares, isXNext, playerName, opponentName, winner} = body;

  // Mettre à jour l'état du jeu
  gameStates[roomId] = {squares, isXNext, playerName, opponentName, winner};
  return NextResponse.json({message: "Game state updated"});
}
