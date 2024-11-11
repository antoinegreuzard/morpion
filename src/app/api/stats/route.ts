import {NextRequest, NextResponse} from "next/server";

// Statistiques du jeu, stockées en mémoire (réinitialisées à chaque redémarrage du serveur)
let stats = {
  aiWins: 0,
  playerWins: 0,
  draws: 0,
};

/**
 * Handler pour la méthode GET : récupérer les statistiques actuelles.
 */
export async function GET() {
  return NextResponse.json(stats);
}

/**
 * Handler pour la méthode POST : mettre à jour les statistiques.
 */
export async function POST(req: NextRequest) {
  const {aiWins, playerWins, draws} = await req.json();

  // Validation des données
  if (
    (aiWins !== undefined && typeof aiWins !== "number") ||
    (playerWins !== undefined && typeof playerWins !== "number") ||
    (draws !== undefined && typeof draws !== "number")
  ) {
    return NextResponse.json({message: "Données invalides."}, {status: 400});
  }

  // Mise à jour des statistiques
  stats.aiWins += aiWins ?? 0;
  stats.playerWins += playerWins ?? 0;
  stats.draws += draws ?? 0;

  return NextResponse.json({message: "Statistiques mises à jour.", stats});
}

/**
 * Handler pour la méthode DELETE : réinitialiser les statistiques.
 */
export async function DELETE() {
  stats = {aiWins: 0, playerWins: 0, draws: 0};
  return NextResponse.json({message: "Statistiques réinitialisées."});
}
