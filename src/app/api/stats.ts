import {NextApiRequest, NextApiResponse} from "next";

// Statistiques du jeu, stockées en mémoire (réinitialisées à chaque redémarrage du serveur)
let stats = {
  aiWins: 0,
  playerWins: 0,
  draws: 0,
};

/**
 * Handler de l'API pour les statistiques du jeu.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      // Retourne les statistiques actuelles
      return res.status(200).json(stats);

    case "POST":
      const {aiWins, playerWins, draws} = req.body;

      // Validation des données
      if (
        (aiWins !== undefined && typeof aiWins !== "number") ||
        (playerWins !== undefined && typeof playerWins !== "number") ||
        (draws !== undefined && typeof draws !== "number")
      ) {
        return res.status(400).json({message: "Données invalides."});
      }

      // Mise à jour des statistiques
      stats.aiWins += aiWins ?? 0;
      stats.playerWins += playerWins ?? 0;
      stats.draws += draws ?? 0;

      return res.status(200).json({message: "Statistiques mises à jour.", stats});

    case "DELETE":
      // Réinitialiser les statistiques
      stats = {aiWins: 0, playerWins: 0, draws: 0};
      return res.status(200).json({message: "Statistiques réinitialisées."});

    default:
      return res.status(405).json({message: "Méthode non autorisée"});
  }
}
