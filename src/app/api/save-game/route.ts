import {NextRequest, NextResponse} from "next/server";
import {query} from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const {squares, isXNext, playerScore, aiScore, drawScore} = await req.json();

    const text = `
      INSERT INTO games (squares, isXNext, playerScore, aiScore, drawScore)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `;
    const values = [JSON.stringify(squares), isXNext, playerScore, aiScore, drawScore];
    const result = await query(text, values);

    return NextResponse.json({message: "Partie sauvegardée !", gameId: result.rows[0].id});
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}
