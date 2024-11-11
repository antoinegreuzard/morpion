import {NextApiRequest, NextApiResponse} from "next";
import {setSavedGame} from "./gameStore";

/**
 * API pour sauvegarder l'état de la partie.
 * Route : POST /api/save-game
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {squares, isXNext, playerScore, aiScore, drawScore} = req.body;

    // Vérifier si les données sont valides
    if (!Array.isArray(squares) || typeof isXNext !== "boolean") {
      return res.status(400).json({message: "Données invalides."});
    }

    // Sauvegarder la partie
    setSavedGame({squares, isXNext, playerScore, aiScore, drawScore});
    return res.status(200).json({message: "Partie sauvegardée !"});
  }

  return res.status(405).json({message: "Méthode non autorisée"});
}
