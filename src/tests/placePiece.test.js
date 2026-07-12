import { describe, it, expect } from "vitest";
import { createShape } from "../components/Pieces";
import { placePiece } from "../components/Board";

const board = Array.from({ length: 5 }, () => new Array(4).fill(null));
const peice = createShape("smallSquare", 0, 0, 0, { m: 0, n: 0 });

describe("smallSquare test", () => {
  it("places smallSquare in first space", () => {
    expect(placePiece(board, peice)).toStrictEqual([{ m: 0, n: 0 }]);
  });
});
