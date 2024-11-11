import {NextRequest, NextResponse} from "next/server";
import {setSavedGame} from "@/app/api/gameStore";

export async function POST(req: NextRequest) {
  const {squares, isXNext, playerScore, aiScore, drawScore} = await req.json();

  // Vérifier si les données sont valides
  if (!Array.isArray(squares) || typeof isXNext !== "boolean") {
    return NextResponse.json({message: "Données invalides."}, {status: 400});
  }

  // Sauvegarder la partie
  setSavedGame({squares, isXNext, playerScore, aiScore, drawScore});
  return NextResponse.json({message: "Partie sauvegardée !"});
}
