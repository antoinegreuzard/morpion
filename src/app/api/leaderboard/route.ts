import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

// Obtenir le classement
export async function GET(req: NextRequest) {
  try {
    const {searchParams} = new URL(req.url);
    const player = searchParams.get("player");

    if (player) {
      const result = await query(`SELECT *
                                  FROM leaderboard
                                  WHERE player = $1`, [player]);
      return result.rows.length > 0
        ? NextResponse.json(result.rows[0])
        : NextResponse.json({message: "Joueur non trouvé."}, {status: 404});
    }

    const result = await query(`SELECT *
                                FROM leaderboard
                                ORDER BY score DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}

// Ajouter ou mettre à jour le score d'un joueur
export async function POST(req: NextRequest) {
  try {
    const {player, score} = await req.json();

    const text = `
      INSERT INTO leaderboard (player, score)
      VALUES ($1, $2) ON CONFLICT (player) DO
      UPDATE
        SET score = GREATEST(leaderboard.score, $2)
        RETURNING *;
    `;
    const values = [player, score];
    const result = await query(text, values);

    return NextResponse.json({message: "Score mis à jour !", player: result.rows[0]});
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}

// Réinitialiser le classement
export async function DELETE() {
  try {
    await query(`DELETE
                 FROM leaderboard`);
    return NextResponse.json({message: "Classement réinitialisé."});
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
