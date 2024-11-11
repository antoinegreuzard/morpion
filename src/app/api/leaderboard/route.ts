import {NextRequest, NextResponse} from "next/server";

// Classement stocké en mémoire (réinitialisé à chaque redémarrage du serveur)
let leaderboard: { player: string; score: number }[] = [];

/**
 * Handler pour la méthode GET : récupérer le classement complet ou le score d'un joueur spécifique.
 */
export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const player = searchParams.get("player");

  if (player) {
    const playerData = leaderboard.find((entry) => entry.player === player);
    if (playerData) {
      return NextResponse.json(playerData);
    }
    return NextResponse.json({message: "Joueur non trouvé."}, {status: 404});
  }

  // Retourner le classement complet trié par score décroissant
  return NextResponse.json(leaderboard.sort((a, b) => b.score - a.score));
}

/**
 * Handler pour la méthode POST : ajouter ou mettre à jour le score d'un joueur.
 */
export async function POST(req: NextRequest) {
  const {player, score} = await req.json();

  // Validation des données
  if (typeof player !== "string" || typeof score !== "number") {
    return NextResponse.json({message: "Données invalides."}, {status: 400});
  }

  // Vérifier si le joueur existe déjà
  const existingPlayer = leaderboard.find((entry) => entry.player === player);
  if (existingPlayer) {
    // Mettre à jour le score si le joueur existe
    existingPlayer.score = Math.max(existingPlayer.score, score);
    return NextResponse.json({message: "Score mis à jour !"});
  }

  // Ajouter un nouveau joueur
  leaderboard.push({player, score});
  return NextResponse.json({message: "Score ajouté !"}, {status: 201});
}

/**
 * Handler pour la méthode DELETE : réinitialiser le classement.
 */
export async function DELETE() {
  leaderboard = [];
  return NextResponse.json({message: "Classement réinitialisé."});
}
