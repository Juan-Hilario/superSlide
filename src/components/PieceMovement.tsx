import { Shape } from "./Pieces";
import { playRandomSound } from "./util/PieceSounds";

type Board = (Shape | null)[][];
type Direction = "left" | "up" | "down" | "right";
type SetPieces = React.Dispatch<React.SetStateAction<Shape[]>>;
type Pieces = Shape[];

const checkMove = (
    pieceId: number,
    pieces: Pieces,
    direction: Direction,
    board: Board,
) => {
    let flag = true;
    if (direction === "left") {
        pieces.map((piece) => {
            if (piece.id !== pieceId) return piece;
            let min = 6;

            for (let i = 0; i < piece.coordinates.length; i++) {
                if (piece.coordinates[i].n < min) {
                    min = piece.coordinates[i].n;
                }
            }
            const filteredCoordArr = piece.coordinates.filter(
                (coord) => coord.n === min,
            );

            filteredCoordArr.map((coord) => {
                if (
                    board[coord.m][coord.n - 1] === undefined ||
                    board[coord.m][coord.n - 1] !== null
                ) {
                    flag = false;
                }
            });
        });
    } else if (direction === "up") {
        pieces.map((piece) => {
            if (piece.id !== pieceId) return piece;

            let min = 6;

            for (let i = 0; i < piece.coordinates.length; i++) {
                if (piece.coordinates[i].m < min) {
                    min = piece.coordinates[i].m;
                }
            }
            const filteredCoordArr = piece.coordinates.filter(
                (coord) => coord.m === min,
            );
            filteredCoordArr.map((coord) => {
                if (
                    board[coord.m - 1] === undefined ||
                    board[coord.m - 1][coord.n] !== null
                ) {
                    flag = false;
                }
            });
        });
    } else if (direction === "down") {
        pieces.map((piece) => {
            if (piece.id !== pieceId) return piece;
            let max = -1;

            for (let i = 0; i < piece.coordinates.length; i++) {
                if (piece.coordinates[i].m > max) {
                    max = piece.coordinates[i].m;
                }
            }

            const filteredCoordArr = piece.coordinates.filter(
                (coord) => coord.m === max,
            );
            filteredCoordArr.map((coord) => {
                if (
                    board[coord.m + 1] === undefined ||
                    board[coord.m + 1][coord.n] !== null
                ) {
                    flag = false;
                }
            });
        });
    } else {
        pieces.map((piece) => {
            if (piece.id !== pieceId) return piece;
            let max = -1;

            for (let i = 0; i < piece.coordinates.length; i++) {
                if (piece.coordinates[i].n > max) {
                    max = piece.coordinates[i].n;
                }
            }

            const filteredCoordArr = piece.coordinates.filter(
                (coord) => coord.n === max,
            );
            filteredCoordArr.map((coord) => {
                if (
                    board[coord.m][coord.n + 1] === undefined ||
                    board[coord.m][coord.n + 1] !== null
                ) {
                    flag = false;
                }
            });
        });
    }

    return flag;
};

export const handlePieceSlide = (
    pieceId: number,
    pieces: Pieces,
    direction: Direction,
    board: Board,
    setPieces: SetPieces,
) => {
    if (!checkMove(pieceId, pieces, direction, board)) {
        return;
    }
    if (direction === "left") {
        setPieces((prevPieces) => {
            return prevPieces.map((piece) => {
                if (piece.id !== pieceId) return piece;

                const newCoords = piece.coordinates.map((coord) => ({
                    m: coord.m,
                    n: coord.n - 1,
                }));
                const newOrigin = {
                    m: piece.origin.m,
                    n: piece.origin.n - 1,
                };

                return {
                    ...piece,
                    origin: newOrigin,
                    coordinates: newCoords,
                };
            });
        });
    } else if (direction === "up") {
        setPieces((prevPieces) => {
            return prevPieces.map((piece) => {
                if (piece.id !== pieceId) return piece;

                const newCoords = piece.coordinates.map((coord) => ({
                    m: coord.m - 1,
                    n: coord.n,
                }));

                const newOrigin = {
                    m: piece.origin.m - 1,
                    n: piece.origin.n,
                };
                return {
                    ...piece,
                    origin: newOrigin,
                    coordinates: newCoords,
                };
            });
        });
    } else if (direction === "down") {
        setPieces((prevPieces) => {
            return prevPieces.map((piece) => {
                if (piece.id !== pieceId) return piece;

                const newCoords = piece.coordinates.map((coord) => ({
                    m: coord.m + 1,
                    n: coord.n,
                }));

                const newOrigin = {
                    m: piece.origin.m + 1,
                    n: piece.origin.n,
                };
                return {
                    ...piece,
                    origin: newOrigin,
                    coordinates: newCoords,
                };
            });
        });
    } else {
        setPieces((prevPieces) => {
            return prevPieces.map((piece) => {
                if (piece.id !== pieceId) return piece;

                const newCoords = piece.coordinates.map((coord) => ({
                    m: coord.m,
                    n: coord.n + 1,
                }));

                const newOrigin = {
                    m: piece.origin.m,
                    n: piece.origin.n + 1,
                };
                return {
                    ...piece,
                    origin: newOrigin,
                    coordinates: newCoords,
                };
            });
        });
    }
    playRandomSound();
};

export const getDirection = (
    pieceId: number,
    pieces: Pieces,
    blankM: number,
    blankN: number,
) => {
    let pieceM, pieceN, type, width, height;

    pieces.map((piece) => {
        if (piece.id !== pieceId) return piece;

        pieceM = piece.coordinates[0].m;
        pieceN = piece.coordinates[0].n;
        type = piece.type;
    });

    if (pieceM === undefined || pieceN === undefined || type === undefined) {
        console.log("Piece not found");
        return;
    }

    switch (type) {
        case "smallSquare":
            width = 1;
            height = 1;
            break;
        case "bigSquare":
            width = 2;
            height = 2;
            break;
        case "verticalRect":
            width = 1;
            height = 2;
            break;
        case "horizontalRect":
            width = 2;
            height = 1;
            break;
        default:
            return;
    }

    const top = pieceM;
    const bottom = pieceM + height - 1;
    const left = pieceN;
    const right = pieceN + width - 1;

    if (blankN < left) {
        return "left";
    } else if (blankN > right) {
        return "right";
    } else if (blankM < top) {
        return "up";
    } else if (blankM > bottom) {
        return "down";
    } else {
        console.error("checkDirection(): Something is wrong");
        return;
    }
};

export const placePiece = (
    board: (Shape | null)[][],
    piece: Shape,
    boardError: { msg: string; error: boolean },
) => {
    const coordinates = Object.values(piece.coordinates);
    const verifiedCoords = [];
    for (let i = 0; i < coordinates.length; i++) {
        const m = coordinates[i].m;
        const n = coordinates[i].n;
        if (m >= board.length || n >= board[0].length) {
            boardError = { msg: "Piece out of bounds", error: true };
            return "Piece out of bounds";
        } else if (board[m][n] !== null) {
            boardError = {
                msg: "Space is occupied by other piece",
                error: true,
            };
            return "Space is occupied by other piece";
        } else {
            verifiedCoords.push(coordinates[i]);
        }
    }
    if (verifiedCoords.length === coordinates.length) {
        verifiedCoords.map((coord) => {
            board[coord.m][coord.n] = piece;
        });
    }

    return verifiedCoords;
};
