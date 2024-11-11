import {NextRequest, NextResponse} from "next/server";
import {setSavedGame} from "@/app/api/gameStore";

export async function POST(req: NextRequest) {
  try {
    const {squares, isXNext, playerScore, aiScore, drawScore} = await req.json();

    // Vérifier si les données sont valides
    if (!Array.isArray(squares) || typeof isXNext !== "boolean") {
      return NextResponse.json({message: "Données invalides."}, {status: 400});
    }

    setSavedGame({squares, isXNext, playerScore, aiScore, drawScore});

    return NextResponse.json({message: "Partie sauvegardée !"});
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}
