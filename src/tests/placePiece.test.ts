import { describe, it, expect, beforeEach } from "vitest";
import { createShape } from "../components/Pieces";
import { placePiece } from "../components/Board";

describe("placePiece", () => {

    let board: (object | null)[][];
    beforeEach(() => {
        board = Array.from({ length: 5 }, () => new Array(4).fill(null));

    })

    it("can place smallSquare in first space", () => {

        const peice = createShape("smallSquare", 0, 0, 0, { m: 0, n: 0 });
        expect(placePiece(board, peice)).toStrictEqual([{ m: 0, n: 0 }]);
    });

    it("can not place horizontalRect out of bounds", () => {

        const peice = createShape("horizontalRect", 0, 3, 1, { m: 0, n: 3 });
        expect(placePiece(board, peice)).toStrictEqual("Piece out of bounds");
    });

    it("can not place piece in space already occupied", () => {
        board[0][0] = {};

        const peice = createShape("verticalRect", 0, 0, 2, { m: 0, n: 0 })
        expect(placePiece(board, peice)).toStrictEqual("Space is occupied by other piece");
    })
});


