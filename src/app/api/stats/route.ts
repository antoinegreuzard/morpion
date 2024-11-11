import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

// Obtenir les statistiques
export async function GET() {
  try {
    const result = await query(`SELECT *
                                FROM stats LIMIT 1`);
    return NextResponse.json(result.rows[0] || {aiWins: 0, playerWins: 0, draws: 0});
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}

// Mettre à jour les statistiques
export async function POST(req: NextRequest) {
  try {
    const {aiWins, playerWins, draws} = await req.json();

    const text = `
      INSERT INTO stats (aiWins, playerWins, draws)
      VALUES ($1, $2, $3) ON CONFLICT (id) DO
      UPDATE
        SET aiWins = stats.aiWins + $1,
        playerWins = stats.playerWins + $2,
        draws = stats.draws + $3
        RETURNING *;
    `;
    const values = [aiWins ?? 0, playerWins ?? 0, draws ?? 0];
    const result = await query(text, values);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des statistiques :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}

// Réinitialiser les statistiques
export async function DELETE() {
  try {
    await query(`UPDATE stats
                 SET aiWins     = 0,
                     playerWins = 0,
                     draws      = 0`);
    return NextResponse.json({message: "Statistiques réinitialisées."});
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des statistiques :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}
