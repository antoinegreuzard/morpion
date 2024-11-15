import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

type GameState = {
  squares: ("X" | "O" | null)[];
  isXNext: boolean;
  playerName?: string;
  opponentName?: string;
  winner?: string;
  startingPlayer?: string;
  player_symbol?: string;
  opponent_symbol?: string;
};

// GET: Récupérer l'état du jeu depuis la base de données
export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.pathname.split("/").pop();

  if (!roomId) {
    return NextResponse.json({error: "roomId is missing"}, {status: 400});
  }

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
      startingPlayer: gameState.starting_player,
      player_symbol: gameState.player_symbol ?? "X",
      opponent_symbol: gameState.opponent_symbol ?? "O",
    });
  }

  // Initialiser l'état du jeu si la salle n'existe pas
  const initialState: GameState = {
    squares: Array(9).fill(null),
    isXNext: true,
    playerName: undefined,
    opponentName: undefined,
    winner: undefined,
    player_symbol: "X",
    opponent_symbol: "O",
  };
  return NextResponse.json(initialState);
}

// POST: Mettre à jour l'état du jeu dans la base de données
export async function POST(req: NextRequest) {
  const roomId = req.nextUrl.pathname.split("/").pop();

  if (!roomId) {
    return NextResponse.json({error: "roomId is missing"}, {status: 400});
  }

  try {
    const {
      squares,
      isXNext,
      playerName,
      opponentName,
      winner,
      startingPlayer,
      player_symbol,
      opponent_symbol
    } = await req.json();

    // Valider les données
    const validatedSquares = Array.isArray(squares) ? squares : Array(9).fill(null);
    const validatedIsXNext = typeof isXNext === "boolean" ? isXNext : true;
    const validatedPlayerSymbol = player_symbol || "X";
    const validatedOpponentSymbol = opponent_symbol || "O";

    const sql = `
      INSERT INTO online_games (room_id, squares, isxnext, player1_name, player2_name, winner, starting_player,
                                player_symbol, opponent_symbol, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) ON CONFLICT (room_id)
      DO
      UPDATE SET
        squares = EXCLUDED.squares,
        isxnext = EXCLUDED.isxnext,
        player1_name = COALESCE (EXCLUDED.player1_name, online_games.player1_name),
        player2_name = COALESCE (EXCLUDED.player2_name, online_games.player2_name),
        winner = EXCLUDED.winner,
        starting_player = EXCLUDED.starting_player,
        player_symbol = COALESCE (EXCLUDED.player_symbol, online_games.player_symbol),
        opponent_symbol = COALESCE (EXCLUDED.opponent_symbol, online_games.opponent_symbol),
        updated_at = NOW();
    `;

    await query(sql, [
      roomId,
      JSON.stringify(validatedSquares),
      validatedIsXNext,
      playerName || null,
      opponentName || null,
      winner || null,
      startingPlayer || null,
      validatedPlayerSymbol,
      validatedOpponentSymbol,
    ]);

    return NextResponse.json({message: "Game state updated"});
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur dans la route POST :", error.message);
      return NextResponse.json({error: "Internal Server Error", details: error.message}, {status: 500});
    } else {
      console.error("Erreur inconnue :", error);
      return NextResponse.json({error: "Internal Server Error", details: "Erreur inconnue"}, {status: 500});
    }
  }
}

// DELETE: Supprimer une room lorsque le joueur quitte la partie
export async function DELETE(req: NextRequest) {
  const roomId = req.nextUrl.pathname.split("/").pop();

  if (!roomId) {
    return NextResponse.json({error: "roomId is missing"}, {status: 400});
  }

  const sql = `
    DELETE
    FROM online_games
    WHERE room_id = $1;
  `;

  try {
    await query(sql, [roomId]);
    return NextResponse.json({message: "Room supprimée avec succès."});
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression de la room :", error);
    return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
  }
}


// PATCH: Mettre à jour l'état d'activité des joueurs
export async function PATCH(req: NextRequest) {
  const roomId = req.nextUrl.pathname.split("/").pop();
  const {player, isActive} = await req.json();

  if (!roomId || !player) {
    return NextResponse.json({error: "Données manquantes"}, {status: 400});
  }

  const column = player === "player1" ? "player1_active" : "player2_active";

  try {
    const sql = `
      UPDATE online_games
      SET ${column} = $1
      WHERE room_id = $2 RETURNING player1_active, player2_active;
    `;
    const result = await query(sql, [isActive, roomId]);

    if (result.rows.length === 0) {
      return NextResponse.json({error: "Room introuvable"}, {status: 404});
    }

    const {player1_active, player2_active} = result.rows[0];

    // Supprimer la room si les deux joueurs sont inactifs
    if (!player1_active && !player2_active) {
      const deleteSql = `DELETE
                         FROM online_games
                         WHERE room_id = $1;`;
      await query(deleteSql, [roomId]);
      return NextResponse.json({message: "Room supprimée car les deux joueurs sont partis."});
    }

    return NextResponse.json({message: "État du joueur mis à jour."});
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour de l'état du joueur :", error);
    return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
  }
}
