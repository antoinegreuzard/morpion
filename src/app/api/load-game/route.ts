import {NextResponse} from "next/server";
import {getSavedGame} from "../gameStore";

export async function GET() {
  const savedGame = getSavedGame();

  if (savedGame) {
    return NextResponse.json(savedGame);
  }

  return NextResponse.json({message: "Aucune partie sauvegardée."}, {status: 404});
}
