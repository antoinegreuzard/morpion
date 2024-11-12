import React from "react";
import {render, screen} from "@testing-library/react";
import Stats, {StatsData} from "@/components/Stats";

describe("Stats Component", () => {
  const mockStats: StatsData = {
    aiwins: 5,
    playerwins: 7,
    draws: 3,
  };

  it("should render the statistics correctly", () => {
    render(<Stats stats={mockStats} isLoading={false} error={null}/>);

    expect(screen.getByText("Victoires IA :")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("Victoires Joueur :")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    expect(screen.getByText("Matchs Nuls :")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should display a loading message when isLoading is true", () => {
    render(<Stats stats={mockStats} isLoading={true} error={null}/>);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should display an error message when error is present", () => {
    const errorMessage = "Une erreur s'est produite.";
    render(<Stats stats={mockStats} isLoading={false} error={errorMessage}/>);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should not display statistics when isLoading is true", () => {
    render(<Stats stats={mockStats} isLoading={true} error={null}/>);

    expect(screen.queryByText("Victoires IA :")).not.toBeInTheDocument();
    expect(screen.queryByText("Victoires Joueur :")).not.toBeInTheDocument();
    expect(screen.queryByText("Matchs Nuls :")).not.toBeInTheDocument();
  });

  it("should not display statistics when there is an error", () => {
    const errorMessage = "Erreur de chargement des statistiques.";
    render(<Stats stats={mockStats} isLoading={false} error={errorMessage}/>);

    expect(screen.queryByText("Victoires IA :")).not.toBeInTheDocument();
    expect(screen.queryByText("Victoires Joueur :")).not.toBeInTheDocument();
    expect(screen.queryByText("Matchs Nuls :")).not.toBeInTheDocument();
  });
});
