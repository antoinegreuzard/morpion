import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js
  dir: "./",
});

// Configuration personnalisée de Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
};

// Exportation de la configuration Jest en utilisant les modules ESM
export default createJestConfig(customJestConfig);
