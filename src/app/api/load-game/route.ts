import {NextResponse} from "next/server";
import {savedGame} from "@/app/api/gameStore";

export async function GET() {
  if (savedGame) {
    return NextResponse.json(savedGame);
  }

  return NextResponse.json({message: "Aucune partie sauvegardée."}, {status: 404});
}
