import {checkWinner} from "./checkWinner";

export const minimax = (
  board: (string | null)[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiSymbol: "X" | "O",
  playerSymbol: "X" | "O"
): number => {
  const winner = checkWinner(board);

  // Évaluation de l'état du plateau
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return -10 + depth;
  if (winner === "Draw") return 0;

  // Maximiser pour l'IA
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, alpha, beta, aiSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);

        // Pruning
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }

  // Minimiser pour le joueur
  else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, alpha, beta, aiSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);

        // Pruning
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
};
