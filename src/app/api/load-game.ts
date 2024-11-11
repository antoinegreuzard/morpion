import {NextApiRequest, NextApiResponse} from "next";
import {savedGame} from "./gameStore";

/**
 * API pour charger l'état de la partie sauvegardée.
 * Route : GET /api/load-game
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (savedGame) {
      return res.status(200).json(savedGame);
    }

    return res.status(404).json({message: "Aucune partie sauvegardée."});
  }

  return res.status(405).json({message: "Méthode non autorisée"});
}
