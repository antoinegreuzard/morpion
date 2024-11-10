import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import Board from "@/components/Board";

describe("Board Component", () => {
  it("affiche le menu de sélection du mode de jeu", async () => {
    render(<Board/>);
    await waitFor(() => expect(screen.getByText("Choisissez le mode de jeu :")).toBeInTheDocument());
    expect(screen.getByText("Solo (IA)")).toBeInTheDocument();
    expect(screen.getByText("Multijoueur")).toBeInTheDocument();
  });
});
