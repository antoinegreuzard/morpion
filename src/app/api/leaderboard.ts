// api/leaderboard.ts
import {NextApiRequest, NextApiResponse} from "next";

// Classement stocké en mémoire (sera réinitialisé à chaque redémarrage du serveur)
let leaderboard: { player: string; score: number }[] = [];

/**
 * Handler de l'API pour gérer le classement.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      // Si un paramètre "player" est fourni, renvoyer le score de ce joueur
      const {player} = req.query;
      if (player && typeof player === "string") {
        const playerData = leaderboard.find((entry) => entry.player === player);
        if (playerData) {
          return res.status(200).json(playerData);
        }
        return res.status(404).json({message: "Joueur non trouvé."});
      }

      // Sinon, renvoyer le classement complet trié
      return res.status(200).json(leaderboard.sort((a, b) => b.score - a.score));

    case "POST":
      const {player: newPlayer, score: newScore} = req.body;

      // Validation des données
      if (typeof newPlayer !== "string" || typeof newScore !== "number") {
        return res.status(400).json({message: "Données invalides."});
      }

      // Vérifier si le joueur existe déjà
      const existingPlayer = leaderboard.find((entry) => entry.player === newPlayer);
      if (existingPlayer) {
        // Mettre à jour le score si le joueur existe
        existingPlayer.score = Math.max(existingPlayer.score, newScore);
        return res.status(200).json({message: "Score mis à jour !"});
      }

      // Ajouter un nouveau joueur
      leaderboard.push({player: newPlayer, score: newScore});
      return res.status(201).json({message: "Score ajouté !"});

    case "DELETE":
      // Réinitialiser le classement
      leaderboard = [];
      return res.status(200).json({message: "Classement réinitialisé."});

    default:
      return res.status(405).json({message: "Méthode non autorisée"});
  }
}
