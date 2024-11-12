/**
 * Effectue une rotation de 90 degrés du plateau.
 */
export const rotate90 = (board: (string | null)[]): (string | null)[] => {
  return [
    board[6], board[3], board[0],
    board[7], board[4], board[1],
    board[8], board[5], board[2],
  ];
};

/**
 * Effectue une réflexion diagonale (bas gauche à haut droit).
 */
export const reflectDiagonal = (board: (string | null)[]): (string | null)[] => {
  return [
    board[0], board[3], board[6],
    board[1], board[4], board[7],
    board[2], board[5], board[8],
  ];
};

/**
 * Effectue une réflexion horizontale du plateau.
 */
export const reflectHorizontal = (board: (string | null)[]): (string | null)[] => {
  return [
    board[2], board[1], board[0],
    board[5], board[4], board[3],
    board[8], board[7], board[6],
  ];
};

/**
 * Génère toutes les transformations possibles du plateau (rotations et réflexions).
 */
export const getAllTransformations = (board: (string | null)[]): (string | null)[][] => {
  const transformations: (string | null)[][] = [];

  // Générer les rotations (0°, 90°, 180°, 270°)
  let rotated = board;
  for (let i = 0; i < 4; i++) {
    rotated = rotate90(rotated);
    transformations.push(rotated);
    transformations.push(reflectHorizontal(rotated));
    transformations.push(reflectDiagonal(rotated));
  }

  return transformations;
};

/**
 * Retourne la forme canonique du plateau en tant que chaîne de caractères.
 */
export const getCanonicalForm = (board: (string | null)[]): string => {
  const transformations = getAllTransformations(board);

  // Convertir chaque transformation en chaîne de caractères
  const boardStrings = transformations.map((transformation) => JSON.stringify(transformation));

  // Retourner la transformation minimale (forme canonique)
  return boardStrings.sort()[0];
};

