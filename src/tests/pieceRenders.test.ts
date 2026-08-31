import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { createShape, Shape } from "../components/Pieces";
import { placePiece } from "../components/PieceMovement";
import Board from "../components/Board";

describe("piece rendering", () => {
    let board: (Shape | null)[][];
    let boardError = { msg: "", error: false };
    beforeEach(() => {
        board = Array.from({ length: 5 }, () => new Array(4).fill(null));
        boardError = { msg: "", error: false };
    });

    it("can place smallSquare in first space", () => {
        const peice = createShape("smallSquare", 0, 0, 0, { m: 0, n: 0 });
        expect(placePiece(board, peice, boardError)).toStrictEqual([{ m: 0, n: 0 }]);
    });

    it("can not place horizontalRect out of bounds", () => {
        const peice = createShape("horizontalRect", 0, 3, 1, { m: 0, n: 3 });
        expect(placePiece(board, peice, boardError)).toStrictEqual("Piece out of bounds");
    });

    it("can not place piece in space already occupied", () => {
        board[0][0] = createShape("smallSquare", 0, 0, 1, { m: 0, n: 3 });

        const peice = createShape("verticalRect", 0, 0, 2, { m: 0, n: 0 });
        expect(placePiece(board, peice, boardError)).toStrictEqual(
            "Space is occupied by other piece",
        );
    });

    // it(“Renders pieces”, () => {
    //     const onExit = vi.fn();

    // 	render(<Board onExit={onExit} />);

    // 	expect(screen.getByRole(//i)).toBeInTheDocument();

    // })
});
