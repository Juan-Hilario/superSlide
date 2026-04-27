import { useState, useEffect } from "react";
import { createShape, Shape, ShapeType } from "./Pieces";
import Win from "./Win";
import "../styles/Board.css";

export interface Level {
  shapes: { type: ShapeType; m: number; n: number }[];
  difficulty: string;
}

function Board() {
  let boardError = { msg: "", error: false };

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
    String(
      `${localStorage.getItem("difficulty") ? localStorage.getItem("difficulty") : ""}`,
    ),
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

  const placePiece = (board: (object | null)[][], piece: Shape) => {
    const coordinates = Object.values(piece.coordinates);
    const verifiedCoords = [];
    for (let i = 0; i < coordinates.length; i++) {
      const m = coordinates[i].m;
      const n = coordinates[i].n;
      if (m >= board.length || n >= board[0].length) {
        boardError = { msg: "Piece out of bounds", error: true };
        return;
      } else if (board[m][n] !== null) {
        boardError = { msg: "Space is occupied by other piece", error: true };
        return;
      } else {
        verifiedCoords.push(coordinates[i]);
      }
    }
    if (verifiedCoords.length === coordinates.length) {
      verifiedCoords.map((coord) => {
        board[coord.m][coord.n] = piece;
      });
    }
  };
  const checkWin = (
    board: ({ id: number; type: string; cordinates: [] } | null)[][],
  ) => {
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
  const createEmptyBoard = () =>
    Array.from({ length: 5 }, () => new Array(4).fill(null));

  const getBoardFromPieces = (pieces: Shape[]) => {
    const newBoard = createEmptyBoard();
    for (const piece of pieces) {
      placePiece(newBoard, piece);
    }
    return newBoard;
  };

  const board = getBoardFromPieces(pieces);

  const handlePieceSlide = (
    pieceId: number,
    direction: "left" | "up" | "down" | "right",
  ) => {
    if (!checkMove(pieceId, direction)) {
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
          const newOrigin = { m: piece.origin.m, n: piece.origin.n - 1 };

          return { ...piece, origin: newOrigin, coordinates: newCoords };
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

          const newOrigin = { m: piece.origin.m - 1, n: piece.origin.n };
          return { ...piece, origin: newOrigin, coordinates: newCoords };
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

          const newOrigin = { m: piece.origin.m + 1, n: piece.origin.n };
          return { ...piece, origin: newOrigin, coordinates: newCoords };
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

          const newOrigin = { m: piece.origin.m, n: piece.origin.n + 1 };
          return { ...piece, origin: newOrigin, coordinates: newCoords };
        });
      });
    }
  };

  const checkMove = (
    pieceId: number,
    direction: "left" | "up" | "down" | "right",
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

  const getDirection = (pieceId: number, blankM: number, blankN: number) => {
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

    const direction = getDirection(currentPieceId, m, n);
    if (direction) {
      handlePieceSlide(currentPieceId, direction);
    }
  };

  useEffect(() => {
    checkWin(board);
  }, [board]);

  useEffect(() => {
    setGameWin(false);
  }, [levelNum, reset]);

  useEffect(() => {
    const boardPieces = document.querySelectorAll(".piece");
    boardPieces.forEach((piece) => {
      const el = piece as HTMLElement;
      if (
        el.dataset.originM == el.dataset.m &&
        el.dataset.originN == el.dataset.n
      ) {
        piece.classList.add("origin");
      } else {
        piece.classList.remove("origin");
      }
    });
  });
  return (
    <>
      {boardError.error ? (
        <div className="boardError">
          <h1>{boardError.msg}</h1>
        </div>
      ) : (
        <>
          <div className="top">
            <h3>Highest Level: {highestLevel + 1}</h3>
            <h1>Level: {levelNum + 1}</h1>
            <h4
              style={{
                color: `${difficulty === "easy" ? "green" : difficulty === "normal" ? "orange" : difficulty === "hard" ? "red" : null} `,
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
          <div className="board">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div className="space">
                  <div
                    className={` ${cell === null ? "blank" : "piece " + cell.type} `}
                    id={`cell-${rowIndex}-${colIndex}`}
                    data-m={rowIndex}
                    data-n={colIndex}
                    data-origin-m={`${cell ? cell.origin.m.toString() : null}`}
                    data-origin-n={`${cell ? cell.origin.n.toString() : null}`}
                    onMouseDown={
                      cell !== null ? () => handleGrab(cell.id) : undefined
                    }
                    onMouseEnter={
                      cell === null
                        ? (e: React.DragEvent<HTMLDivElement>) => {
                            if (currentPieceId === null) return;
                            const element = e.target as HTMLElement;
                            const m = Number(
                              (element as HTMLElement).dataset.m,
                            );
                            const n = Number(
                              (element as HTMLElement).dataset.n,
                            );
                            handleHoverBlank(m, n);
                          }
                        : undefined
                    }
                    key={colIndex}
                  >
                    <div className="outer"></div>
                    <div className="inner"></div>
                  </div>
                </div>
              )),
            )}
          </div>
          {gameWin ? (
            <Win
              levelFunction={changeLevel}
              levelNum={levelNum}
              levels={levels}
            />
          ) : null}
        </>
      )}
    </>
  );
}

export default Board;
