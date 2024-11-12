import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

// Obtenir les statistiques
export async function GET() {
  try {
    const result = await query(`SELECT *
                                FROM stats LIMIT 1`);
    return NextResponse.json(result.rows[0] || {aiWins: 0, playerWins: 0, draws: 0});
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}

// Mettre à jour les statistiques
export async function POST(req: NextRequest) {
  try {
    const {aiWins, playerWins, draws} = await req.json();

    const text = `
      INSERT INTO stats (aiwins, playerwins, draws)
      VALUES ($1, $2, $3) ON CONFLICT (id) DO
      UPDATE
        SET aiWins = stats.aiwins + $1,
        playerWins = stats.playerwins + $2,
        draws = stats.draws + $3
        RETURNING *;
    `;
    const values = [aiWins ?? 0, playerWins ?? 0, draws ?? 0];
    const result = await query(text, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}

// Réinitialiser les statistiques
export async function DELETE() {
  try {
    await query(`UPDATE stats
                 SET aiwins     = 0,
                     playerwins = 0,
                     draws      = 0`);
    return NextResponse.json({message: "Statistiques réinitialisées."});
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
