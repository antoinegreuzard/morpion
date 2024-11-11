import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import GameControls from "@/components/GameControls";

describe("GameControls Component", () => {
  const mockSaveGame = jest.fn();
  const mockLoadGame = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render both buttons", () => {
    render(<GameControls saveGame={mockSaveGame} loadGame={mockLoadGame}/>);

    // Vérifier que les deux boutons sont rendus
    expect(screen.getByText("Sauvegarder la Partie")).toBeInTheDocument();
    expect(screen.getByText("Charger la Partie")).toBeInTheDocument();
  });

  it("should call `saveGame` function when 'Sauvegarder la Partie' button is clicked", () => {
    render(<GameControls saveGame={mockSaveGame} loadGame={mockLoadGame}/>);

    // Simuler le clic sur le bouton "Sauvegarder la Partie"
    fireEvent.click(screen.getByText("Sauvegarder la Partie"));

    // Vérifier que la fonction `saveGame` a été appelée une fois
    expect(mockSaveGame).toHaveBeenCalledTimes(1);
  });

  it("should call `loadGame` function when 'Charger la Partie' button is clicked", () => {
    render(<GameControls saveGame={mockSaveGame} loadGame={mockLoadGame}/>);

    // Simuler le clic sur le bouton "Charger la Partie"
    fireEvent.click(screen.getByText("Charger la Partie"));

    // Vérifier que la fonction `loadGame` a été appelée une fois
    expect(mockLoadGame).toHaveBeenCalledTimes(1);
  });
});
