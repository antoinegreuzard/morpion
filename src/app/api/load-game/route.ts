import {NextResponse} from "next/server";
import {query} from "@/utils/db";

export async function GET() {
  try {
    const text = `SELECT *
                  FROM games
                  ORDER BY id DESC LIMIT 1`;
    const result = await query(text);

    if (result.rows.length === 0) {
      return NextResponse.json({message: "Aucune partie sauvegardée."}, {status: 404});
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
    return NextResponse.json({message: "Erreur serveur."}, {status: 500});
  }
}
