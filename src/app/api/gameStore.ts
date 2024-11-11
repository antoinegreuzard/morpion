export let savedGame: {
  squares: ("X" | "O" | null)[];
  isXNext: boolean;
  playerScore: number;
  aiScore: number;
  drawScore: number;
} | null = null;

export const setSavedGame = (game: typeof savedGame) => {
  savedGame = game;
};

export const getSavedGame = () => {
  return savedGame;
};