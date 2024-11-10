import {checkWinner} from "./checkWinner";
import {getCanonicalForm} from "./getCanonicalForm";

// Cache pour mémoriser les résultats des états déjà calculés
const memo = new Map<string, number>();

/**
 * Réinitialiser le cache pour chaque nouvelle partie.
 */
export const resetMemo = (): void => {
  memo.clear();
};

/**
 * Fonction d'évaluation améliorée pour analyser les positions intermédiaires.
 * Prend en compte les stratégies de la vidéo et améliore la défense.
 */
const evaluateBoard = (board: (string | null)[], aiSymbol: "X" | "O", playerSymbol: "X" | "O"): number => {
  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];
  let score = 0;

  // Prioriser le contrôle des coins
  for (const corner of corners) {
    if (board[corner] === aiSymbol) score += 3;
    if (board[corner] === playerSymbol) score -= 3;
  }

  // Prioriser le centre
  if (board[4] === aiSymbol) score += 4;
  if (board[4] === playerSymbol) score -= 4;

  // Prioriser les bords
  for (const edge of edges) {
    if (board[edge] === aiSymbol) score += 1;
    if (board[edge] === playerSymbol) score -= 1;
  }

  // Prévoir et créer des forks
  if (board[4] === aiSymbol) {
    for (const corner of corners) {
      if (board[corner] === aiSymbol) score += 5;
    }
  }
  if (board[4] === playerSymbol) {
    for (const corner of corners) {
      if (board[corner] === playerSymbol) score -= 5;
    }
  }

  return score;
};

/**
 * Vérifie si l'adversaire a une opportunité de gagner et retourne l'index à bloquer.
 */
const findWinningMove = (board: (string | null)[], symbol: "X" | "O"): number | null => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = symbol;
      const winner = checkWinner(board);
      board[i] = null;
      if (winner === symbol) {
        return i;
      }
    }
  }
  return null;
};

/**
 * Fonction minimax optimisée avec Alpha-Beta Pruning et défense améliorée.
 */
export const minimax = (
  board: (string | null)[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiSymbol: "X" | "O",
  playerSymbol: "X" | "O",
  maxDepth: number = 6
): number => {
  // Réinitialiser le cache au début
  if (depth === 0) resetMemo();

  // Obtenir la forme canonique du plateau pour normaliser l'état
  const canonicalForm = getCanonicalForm(board);

  // Vérifier si l'état est déjà calculé
  if (memo.has(canonicalForm)) {
    return memo.get(canonicalForm)!;
  }

  const winner = checkWinner(board);

  // Évaluation de l'état du plateau
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return -10 + depth;
  if (winner === "Draw") return 0;

  // Limiter la profondeur pour améliorer la performance
  if (depth >= maxDepth) {
    return evaluateBoard(board, aiSymbol, playerSymbol);
  }

  // Détection d'un coup gagnant pour l'adversaire
  const opponentWinningMove = findWinningMove(board, playerSymbol);
  if (opponentWinningMove !== null) {
    return isMaximizing ? -10 + depth : 10 - depth;
  }

  // Maximiser pour l'IA
  if (isMaximizing) {
    let bestScore = -Infinity;
    const optimalMoves = [0, 2, 4, 6, 8, 1, 3, 5, 7]; // Prioriser les coins, le centre, puis les bords
    for (const i of optimalMoves) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, alpha, beta, aiSymbol, playerSymbol, maxDepth);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);

        // Pruning
        if (beta <= alpha) break;
      }
    }
    // Mémoriser le résultat
    memo.set(canonicalForm, bestScore);
    return bestScore;
  }

  // Minimiser pour le joueur
  else {
    let bestScore = Infinity;
    const optimalMoves = [0, 2, 4, 6, 8, 1, 3, 5, 7]; // Prioriser les coins, le centre, puis les bords
    for (const i of optimalMoves) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, alpha, beta, aiSymbol, playerSymbol, maxDepth);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);

        // Pruning
        if (beta <= alpha) break;
      }
    }
    // Mémoriser le résultat
    memo.set(canonicalForm, bestScore);
    return bestScore;
  }
};
