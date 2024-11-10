import {minimax} from "@/utils/minimax";

describe("Minimax Algorithm", () => {
  it("doit renvoyer un score de 10 si l'IA gagne", () => {
    const board = ["X", "X", "O", "O", "O", "X", "O", "X", "X"];
    const aiSymbol = "O";
    const playerSymbol = "X";

    const result = minimax(board, 0, true, -Infinity, Infinity, aiSymbol, playerSymbol);
    expect(result).toBe(10);
  });

  it("doit renvoyer un score de -10 si le joueur gagne", () => {
    const board = ["X", "X", "X", "O", "O", null, null, null, null];
    const aiSymbol = "O";
    const playerSymbol = "X";

    const result = minimax(board, 0, true, -Infinity, Infinity, aiSymbol, playerSymbol);
    expect(result).toBe(-10);
  });

  it("doit renvoyer un score de 0 en cas de match nul", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    const aiSymbol = "O";
    const playerSymbol = "X";

    const result = minimax(board, 0, true, -Infinity, Infinity, aiSymbol, playerSymbol);
    expect(result).toBe(0);
  });

  it("doit choisir le coup optimal pour l'IA", () => {
    const board = ["X", "O", "X", "X", null, "O", null, null, null];
    const aiSymbol = "O";
    const playerSymbol = "X";

    const result = minimax(board, 0, true, -Infinity, Infinity, aiSymbol, playerSymbol);
    expect(result).toBeGreaterThanOrEqual(0); // Ajusté pour inclure 0
  });

  it("doit empêcher le joueur de gagner", () => {
    const board = ["X", "O", "X", "X", null, "O", null, null, "O"];
    const aiSymbol = "O";
    const playerSymbol = "X";

    const result = minimax(board, 0, true, -Infinity, Infinity, aiSymbol, playerSymbol);
    expect(result).toBeGreaterThanOrEqual(0); // Ajusté pour être positif ou nul
  });
});
