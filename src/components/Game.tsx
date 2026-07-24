import { useState, useEffect } from "react";
import { createShape, Shape, ShapeType } from "./Pieces";
import Win from "./Win";
import Board from "./Board";
import "../styles/Board.css";

export interface Level {
    shapes: { type: ShapeType; m: number; n: number }[];
    difficulty: string;
}

export type BoardProps = {
    onExit: () => void;
};

let boardError = { msg: "", error: false };

export const placePiece = (board: (Shape | null)[][], piece: Shape) => {
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

function Game({ onExit }: BoardProps) {
    const [levels, setLevels] = useState<Level[] | []>([]);
    const [highestLevel, setHighestLevel] = useState<number>(
        Number(
            `${localStorage.getItem("highestLevel") ? localStorage.getItem("highestLevel") : 0}`,
        ),
    );

    const [levelNum, setLevelNum] = useState<number>(
        Number(
            `${localStorage.getItem("currentLevel") ? localStorage.getItem("currentLevel") : 0}`,
        ),
    );

    const [difficulty, setDifficulty] = useState<string>(
        String(`${localStorage.getItem("difficulty") ? localStorage.getItem("difficulty") : ""}`),
    );

    const [gameWin, setGameWin] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);

    localStorage.setItem("currentLevel", levelNum.toString());
    localStorage.setItem("highestLevel", highestLevel.toString());
    localStorage.setItem("difficulty", difficulty.toString());

    // Get Levels from levels.json
    const fetchLevels = async () => {
        await fetch("levels.json")
            .then((res) => {
                return res.json();
            })
            .then((levels) => {
                setLevels(levels);
            });
    };

    const isHighestLevel = (level: number) => {
        if (highestLevel < level) {
            return true;
        } else return false;
    };

    const changeLevel = (option: "again" | "next" | "prev") => {
        switch (option) {
            case "again":
                setReset(!reset);
                break;
            case "next":
                if (levelNum + 1 < levels.length) {
                    setLevelNum(levelNum + 1);
                    setDifficulty(levels[levelNum + 1].difficulty);
                }
                break;
            case "prev":
                if (levelNum - 1 >= 0) {
                    setLevelNum(levelNum - 1);

                    setDifficulty(levels[levelNum - 1].difficulty);
                }
                break;
        }
    };

    useEffect(() => {
        if (levels.length == 0) {
            fetchLevels();
        }
    }, []);

    const checkWin = (board: ({ id: number; type: string; cordinates: [] } | null)[][]) => {
        if (
            board[3][1] == null ||
            board[3][2] == null ||
            board[4][1] == null ||
            board[4][2] == null
        ) {
            return;
        } else if (
            board[3][1].id == 0 &&
            board[3][2].id == 0 &&
            board[4][1].id == 0 &&
            board[4][2].id == 0
        ) {
            setGameWin(true);
            if (isHighestLevel(levelNum)) {
                setHighestLevel(levelNum);
            }
        } else {
            return;
        }
    };

    let id = 1;
    function getId(shapeType: ShapeType) {
        if (shapeType === "bigSquare") return 0;
        return id++;
    }

    const [pieces, setPieces] = useState<Shape[]>([]);

    useEffect(() => {
        if (levels[levelNum]) {
            const newPieces = levels[levelNum].shapes.map((shape) =>
                createShape(shape.type, shape.m, shape.n, getId(shape.type)),
            );
            setPieces(newPieces);
        }
    }, [levels, levelNum, reset]);

    // Builds empty board
    const createEmptyBoard = () => Array.from({ length: 5 }, () => new Array(4).fill(null));

    const getBoardFromPieces = (pieces: Shape[]) => {
        const newBoard = createEmptyBoard();
        for (const piece of pieces) {
            placePiece(newBoard, piece);
        }
        return newBoard;
    };

    const board = getBoardFromPieces(pieces);

    useEffect(() => {
        checkWin(board);
    }, [board]);

    useEffect(() => {
        setGameWin(false);
    }, [levelNum, reset]);

    return (
        <>
            {boardError.error ? (
                <div className="boardError">
                    <h1>{boardError.msg}</h1>
                </div>
            ) : (
                <>
                    <div className="game">
                        <div className="top">
                            <button className="exit-btn" onClick={onExit}>
                                Exit
                            </button>
                            <div className="top-right">
                                <div className="instructions">
                                    <h2>How to Play</h2>
                                    <ul style={{ textAlign: "left" }}>
                                        <li>
                                            The goal of the game is to get the big red square into
                                            the bottom center of the board, marked in light gray.
                                        </li>
                                        <li>
                                            {" "}
                                            To slide the peices around you can drag them with your
                                            mouse to an empty space. A piece will only move if there
                                            is enough space for it to move.
                                        </li>
                                        <li>
                                            There are only {levels.length} levels at this point,
                                            with many more levels to come. All levels are
                                            possible.{" "}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="main">
                            <div className="level-controls">
                                <h3>Highest Level: {highestLevel + 1}</h3>
                                <h1>Level: {levelNum + 1}</h1>
                                <h4
                                    style={{
                                        color: `${difficulty === "easy" ? "green" : difficulty === "medium" ? "orange" : difficulty === "hard" ? "red" : null} `,
                                    }}
                                >
                                    {difficulty}
                                </h4>

                                <button onClick={() => changeLevel("prev")}>Prev</button>
                                <button onClick={() => changeLevel("again")}>Reset</button>

                                {highestLevel >= levelNum + 1 ? (
                                    <button onClick={() => changeLevel("next")}>Next</button>
                                ) : null}
                            </div>

                            <Board board={board} pieces={pieces} setPieces={setPieces} />
                        </div>
                        {gameWin ? (
                            <Win levelFunction={changeLevel} levelNum={levelNum} levels={levels} />
                        ) : null}
                    </div>
                </>
            )}
        </>
    );
}

export default Game;
