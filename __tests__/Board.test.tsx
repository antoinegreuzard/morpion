import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import Board from "@/components/Board";

describe("Board Component", () => {
  it("affiche le menu de sélection du mode de jeu", async () => {
    render(<Board/>);
    await waitFor(() => expect(screen.getByText("Choisissez le mode de jeu :")).toBeInTheDocument());
    expect(screen.getByText("Solo (IA)")).toBeInTheDocument();
    expect(screen.getByText("Multijoueur")).toBeInTheDocument();
  });

  it("affiche le gagnant lorsqu'une ligne est complétée", async () => {
    render(<Board/>);
    fireEvent.click(screen.getByText("Solo (IA)"));
    fireEvent.click(screen.getByText("Joueur commence (X)"));

    const squares = screen.getAllByRole("button");

    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[1]); // O (IA)
    fireEvent.click(squares[3]); // X
    fireEvent.click(squares[4]); // O (IA)
    fireEvent.click(squares[6]); // X

    // Utiliser findByText pour attendre le rendu
    const winnerText = await screen.findByText((content) => content.includes("Gagnant : X"));
    expect(winnerText).toBeInTheDocument();
  });
});
