// src/app/api/game/[roomId]/route.ts
import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

type GameState = {
  squares: ("X" | "O" | null)[];
  isXNext: boolean;
  playerName?: string;
  opponentName?: string;
  winner?: string;
};

// GET: Récupérer l'état du jeu depuis la base de données
export async function GET(req: NextRequest, {params}: { params: { roomId: string } }) {
  const {roomId} = params;

  const sql = "SELECT * FROM online_games WHERE room_id = $1";
  const result = await query(sql, [roomId]);

  if (result.rows.length > 0) {
    const gameState = result.rows[0];
    return NextResponse.json({
      squares: JSON.parse(gameState.squares),
      isXNext: gameState.isxnext,
      playerName: gameState.player1_name,
      opponentName: gameState.player2_name,
      winner: gameState.winner,
    });
  }

  // Initialiser l'état du jeu si la salle n'existe pas
  const initialState: GameState = {squares: Array(9).fill(null), isXNext: true};
  return NextResponse.json(initialState);
}

// POST: Mettre à jour l'état du jeu dans la base de données
export async function POST(req: NextRequest, {params}: { params: { roomId: string } }) {
  const {roomId} = params;
  const {squares, isXNext, playerName, opponentName, winner} = await req.json();

  const sql = `
    INSERT INTO online_games (room_id, squares, isxnext, player1_name, player2_name, winner, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT (room_id)
    DO
    UPDATE SET
      squares = EXCLUDED.squares,
      isxnext = EXCLUDED.isxnext,
      player1_name = EXCLUDED.player1_name,
      player2_name = EXCLUDED.player2_name,
      winner = EXCLUDED.winner,
      updated_at = NOW();
  `;

  await query(sql, [roomId, JSON.stringify(squares), isXNext, playerName, opponentName, winner]);

  return NextResponse.json({message: "Game state updated"});
}
