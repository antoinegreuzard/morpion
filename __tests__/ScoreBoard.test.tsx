import React from "react";
import {render, screen} from "@testing-library/react";
import ScoreBoard from "@/components/ScoreBoard";

describe("ScoreBoard Component", () => {
  it("affiche correctement le titre", () => {
    render(<ScoreBoard playerScore={0} aiScore={0} drawScore={0}/>);
    expect(screen.getByText("Score")).toBeInTheDocument();
  });

  it("affiche le score du joueur", () => {
    render(<ScoreBoard playerScore={5} aiScore={3} drawScore={2}/>);
    const playerScore = screen.getByText("Joueur (X) :");
    const playerScoreValue = screen.getByText("5");
    expect(playerScore).toBeInTheDocument();
    expect(playerScoreValue).toBeInTheDocument();
  });

  it("affiche le score des matchs nuls", () => {
    render(<ScoreBoard playerScore={5} aiScore={3} drawScore={2}/>);
    const drawScore = screen.getByText("Matchs nuls :");
    const drawScoreValue = screen.getByText("2");
    expect(drawScore).toBeInTheDocument();
    expect(drawScoreValue).toBeInTheDocument();
  });

  it("affiche le score de l'IA", () => {
    render(<ScoreBoard playerScore={5} aiScore={3} drawScore={2}/>);
    const aiScore = screen.getByText("IA (O) :");
    const aiScoreValue = screen.getByText("3");
    expect(aiScore).toBeInTheDocument();
    expect(aiScoreValue).toBeInTheDocument();
  });
});
