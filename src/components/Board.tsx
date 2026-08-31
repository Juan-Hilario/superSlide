import { useState, useEffect } from "react";
import { createShape, Shape, ShapeType } from "./Pieces";
import {
    smallSquareRendering,
    bigSquareRendering,
    horizontalRectRendering,
    verticalRectRendering,
} from "./PieceRendering";
import { handlePieceSlide, getDirection, placePiece } from "./PieceMovement";
import "../styles/Board.css";

export interface Level {
    shapes: { type: ShapeType; m: number; n: number }[];
    difficulty: string;
}

export type BoardProps = {
    board: (Shape | null)[][];
    pieces: Shape[];
    setPieces: React.Dispatch<React.SetStateAction<Shape[]>>;
};

function Board({ board, pieces, setPieces }: BoardProps) {
    const [currentPieceId, setCurrentPieceId] = useState<number | null>(null);

    useEffect(() => {
        const dragEnd = () => {
            setCurrentPieceId(null);
        };

        document.addEventListener("mouseup", dragEnd);

        return () => {
            document.removeEventListener("mouseup", dragEnd);
        };
    });

    const handleGrab = (pieceId: number) => {
        setCurrentPieceId(pieceId);
    };

    const handleHoverBlank = (m: number, n: number) => {
        if (currentPieceId == null) return;

        const direction = getDirection(currentPieceId, pieces, m, n);
        console.log("m: ", m, "n: ", n, "direction: ", direction);
        if (direction) {
            handlePieceSlide(currentPieceId, pieces, direction, board, setPieces);
        }
    };

    useEffect(() => {
        const boardPieces = document.querySelectorAll(".piece");
        boardPieces.forEach((piece) => {
            const el = piece as HTMLElement;
            if (el.dataset.originM == el.dataset.m && el.dataset.originN == el.dataset.n) {
                piece.classList.add("origin");
            } else {
                piece.classList.remove("origin");
            }
        });
    });

    const renderingMap: Record<string, JSX.Element> = {
        smallSquare: smallSquareRendering,
        bigSquare: bigSquareRendering,
        horizontalRect: horizontalRectRendering,
        verticalRect: verticalRectRendering,
    };

    return (
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const isOrigin =
                        cell !== null && cell.origin.m === rowIndex && cell.origin.n === colIndex;

                    return (
                        <div className="space">
                            <div
                                className={` ${cell === null ? "blank" : "piece " + cell.type} `}
                                id={`cell-${rowIndex}-${colIndex}`}
                                data-m={rowIndex}
                                data-n={colIndex}
                                data-origin-m={`${cell ? cell.origin.m.toString() : null}`}
                                data-origin-n={`${cell ? cell.origin.n.toString() : null}`}
                                onMouseDown={cell !== null ? () => handleGrab(cell.id) : undefined}
                                onMouseEnter={
                                    cell === null
                                        ? (e: React.DragEvent<HTMLDivElement>) => {
                                              if (currentPieceId === null) return;
                                              const element = e.target as HTMLElement;
                                              const m = Number((element as HTMLElement).dataset.m);
                                              const n = Number((element as HTMLElement).dataset.n);
                                              handleHoverBlank(m, n);
                                          }
                                        : undefined
                                }
                                key={colIndex}
                            >
                                {cell?.type && isOrigin ? (
                                    renderingMap[cell.type]
                                ) : (
                                    <>
                                        <div className="outer"></div>
                                        <div className="inner"></div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                }),
            )}
        </div>
    );
}

export default Board;
