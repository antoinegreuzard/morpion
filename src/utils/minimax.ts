import {checkWinner} from "./checkWinner";

export const minimax = (board: (string | null)[], depth: number, isMaximizing: boolean): number => {
  const winner = checkWinner(board);

  // Évaluation de l'état du plateau
  if (winner === "X") return -10 + depth;
  if (winner === "O") return 10 - depth;
  if (winner === "Draw") return 0;

  // Maximiser pour l'IA (O)
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  }

  // Minimiser pour le joueur (X)
  else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};
