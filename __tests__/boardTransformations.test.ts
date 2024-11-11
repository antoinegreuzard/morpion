import {
  rotate90,
  reflectDiagonal,
  reflectHorizontal,
  getCanonicalForm,
  getAllTransformations
} from "@/utils/getCanonicalForm";

describe("Board transformations", () => {
  const initialBoard = [
    "X", "O", "X",
    null, "O", null,
    "O", "X", null
  ];

  it("should rotate the board by 90 degrees", () => {
    const rotated90 = rotate90(initialBoard);
    expect(rotated90).toEqual([
      "O", null, "X",
      "X", "O", "O",
      null, null, "X"
    ]);
  });

  it("should reflect the board diagonally", () => {
    const reflectedDiagonal = reflectDiagonal(initialBoard);
    expect(reflectedDiagonal).toEqual([
      "X", null, "O",
      "O", "O", "X",
      "X", null, null
    ]);
  });

  it("should reflect the board horizontally", () => {
    const reflectedHorizontal = reflectHorizontal(initialBoard);
    expect(reflectedHorizontal).toEqual([
      "X", "O", "X",
      null, "O", null,
      null, "X", "O"
    ]);
  });

  it("should return the canonical form of the board", () => {
    getAllTransformations(initialBoard);
    const canonicalForm = getCanonicalForm(initialBoard);
    const expectedCanonicalForm = JSON.stringify([
      "O", "X", null,
      null, "O", null,
      "X", "O", "X"
    ]);

    expect(canonicalForm).toEqual(expectedCanonicalForm);
  });
});
