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
  if (board[4] === aiSymbol) score += 5;
  if (board[4] === playerSymbol) score -= 5;

  // Prioriser les bords
  for (const edge of edges) {
    if (board[edge] === aiSymbol) score += 1;
    if (board[edge] === playerSymbol) score -= 1;
  }

  // Défense contre les forks
  const forkMove = findFork(board, playerSymbol);
  if (forkMove !== null) {
    score -= 15;
  }

  // Défense améliorée
  const criticalDefenseScore = findCriticalDefense(board, playerSymbol, aiSymbol);
  score -= criticalDefenseScore * 10;

  return score;
};

/**
 * Fonction pour trouver des situations de défense critiques où l'adversaire a deux cases dans une ligne, colonne ou diagonale.
 */
const findCriticalDefense = (board: (string | null)[], playerSymbol: "X" | "O", aiSymbol: "X" | "O"): number => {
  let criticalDefenseScore = 0;
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const line of lines) {
    const [a, b, c] = line;

    // Défense contre les positions critiques de l'adversaire
    if (board[a] === playerSymbol && board[b] === playerSymbol && board[c] === null) criticalDefenseScore += 1;
    if (board[a] === playerSymbol && board[c] === playerSymbol && board[b] === null) criticalDefenseScore += 1;
    if (board[b] === playerSymbol && board[c] === playerSymbol && board[a] === null) criticalDefenseScore += 1;

    // Avantage pour l'IA si elle a deux cases consécutives non bloquées
    if (board[a] === aiSymbol && board[b] === aiSymbol && board[c] === null) criticalDefenseScore -= 1;
    if (board[a] === aiSymbol && board[c] === aiSymbol && board[b] === null) criticalDefenseScore -= 1;
    if (board[b] === aiSymbol && board[c] === aiSymbol && board[a] === null) criticalDefenseScore -= 1;
  }

  return criticalDefenseScore;
};

/**
 * Détecte une fork potentielle pour un symbole donné.
 */
const findFork = (board: (string | null)[], symbol: "X" | "O"): number | null => {
  const possibleForks = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = symbol;
      const winningMoves = [];

      for (let j = 0; j < board.length; j++) {
        if (board[j] === null) {
          board[j] = symbol;
          if (checkWinner(board) === symbol) {
            winningMoves.push(j);
          }
          board[j] = null;
        }
      }

      if (winningMoves.length >= 2) {
        possibleForks.push(i);
      }

      board[i] = null;
    }
  }

  return possibleForks.length > 0 ? possibleForks[0] : null;
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
  if (depth === 0) resetMemo();

  const canonicalForm = getCanonicalForm(board);

  if (memo.has(canonicalForm)) {
    return memo.get(canonicalForm)!;
  }

  const winner = checkWinner(board);

  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return -10 + depth;
  if (winner === "Draw") return 0;

  if (depth >= maxDepth) {
    return evaluateBoard(board, aiSymbol, playerSymbol);
  }

  // Priorité de défense : bloquer le coup gagnant de l'adversaire
  const criticalMove = findCriticalMove(board, playerSymbol);
  if (criticalMove !== null && isMaximizing) {
    // Si l'adversaire a un coup gagnant, l'IA bloque ce coup immédiatement
    board[criticalMove] = aiSymbol;
    const score = minimax(board, depth + 1, false, alpha, beta, aiSymbol, playerSymbol, maxDepth);
    board[criticalMove] = null;
    return score;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, alpha, beta, aiSymbol, playerSymbol, maxDepth);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);

        if (beta <= alpha) break;
      }
    }
    memo.set(canonicalForm, bestScore);
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, alpha, beta, aiSymbol, playerSymbol, maxDepth);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);

        if (beta <= alpha) break;
      }
    }
    memo.set(canonicalForm, bestScore);
    return bestScore;
  }
};

/**
 * Vérifie si l'adversaire a une opportunité de gagner ou de créer une fork et retourne l'index à bloquer.
 */
const findCriticalMove = (board: (string | null)[], symbol: "X" | "O"): number | null => {
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

  const forkMove = findFork(board, symbol);
  if (forkMove !== null) {
    return forkMove;
  }

  return null;
};
