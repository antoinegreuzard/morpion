import {checkWinner} from "@/utils/checkWinner";

describe("checkWinner Function", () => {
  it("doit retourner 'X' pour une victoire horizontale sur la première ligne", () => {
    const board = ["X", "X", "X", null, "O", null, "O", null, null];
    expect(checkWinner(board)).toBe("X");
  });

  it("doit retourner 'O' pour une victoire horizontale sur la deuxième ligne", () => {
    const board = ["X", null, "X", "O", "O", "O", null, null, "X"];
    expect(checkWinner(board)).toBe("O");
  });

  it("doit retourner 'X' pour une victoire verticale sur la première colonne", () => {
    const board = ["X", "O", null, "X", "O", null, "X", null, "O"];
    expect(checkWinner(board)).toBe("X");
  });

  it("doit retourner 'O' pour une victoire verticale sur la deuxième colonne", () => {
    const board = ["X", "O", null, "X", "O", null, null, "O", "X"];
    expect(checkWinner(board)).toBe("O");
  });

  it("doit retourner 'X' pour une victoire diagonale (de haut à gauche à bas à droite)", () => {
    const board = ["X", "O", "O", null, "X", null, null, null, "X"];
    expect(checkWinner(board)).toBe("X");
  });

  it("doit retourner 'O' pour une victoire diagonale (de haut à droite à bas à gauche)", () => {
    const board = ["X", null, "O", "X", "O", null, "O", null, "X"];
    expect(checkWinner(board)).toBe("O");
  });

  it("doit retourner 'Draw' si toutes les cases sont remplies et il n'y a pas de gagnant", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(checkWinner(board)).toBe("Draw");
  });

  it("doit retourner 'null' si le jeu n'est pas encore terminé", () => {
    const board = ["X", "O", null, "X", "O", null, null, null, "X"];
    expect(checkWinner(board)).toBeNull();
  });
});
