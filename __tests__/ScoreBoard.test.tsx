import React from "react";
import {render, screen} from "@testing-library/react";
import ScoreBoard from "@/components/ScoreBoard";

describe("ScoreBoard Component", () => {
  const defaultProps = {
    playerScore: 3,
    aiScore: 2,
    drawScore: 1,
    playerName: "Joueur 1",
    opponentName: "Joueur 2",
    mode: "multiplayer" as "solo" | "multiplayer",
  };

  it("should render the component correctly", () => {
    render(<ScoreBoard {...defaultProps} />);

    // Vérifier le titre
    expect(screen.getByText("Score")).toBeInTheDocument();
  });

  it("should display the player's score and name", () => {
    render(<ScoreBoard {...defaultProps} />);

    // Vérifier le nom du joueur et son score
    expect(screen.getByText("Joueur 1 (X) :")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should display the draw score", () => {
    render(<ScoreBoard {...defaultProps} />);

    // Vérifier le score des matchs nuls
    expect(screen.getByText("Matchs nuls :")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should display the opponent's score and name in multiplayer mode", () => {
    render(<ScoreBoard {...defaultProps} />);

    // Vérifier le nom de l'adversaire et son score en mode multijoueur
    expect(screen.getByText("Joueur 2 (O) :")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should display the opponent's score as the player's name in solo mode", () => {
    render(<ScoreBoard {...defaultProps} mode="solo"/>);

    // En mode solo, le nom de l'adversaire doit être le nom du joueur
    expect(screen.getByText("Joueur 1 (O) :")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
