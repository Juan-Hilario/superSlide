import { useState } from "react";
import { createShape, Shape } from "./Pieces";
import Win from "./Win";
import "../styles/Board.css";

function Board() {
  let boardError = { msg: "", error: false };

  const [level, setLevel] = useState<number>(0);

  const changeLevel = (direction: "next" | "prev") => {
    if (direction === "next") {
      setLevel(level + 1);
    } else if (direction === "prev") {
      setLevel(level - 1);
    }
  };

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
    if (gameWin) {
      return;
    }

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
    } else {
      return;
    }
  };

  let id = 1;
  function getId(shapeType: string) {
    if (shapeType === "bigSquare") return 0;
    return id++;
  }

  const [pieces, setPieces] = useState([
    createShape("smallSquare", 4, 0, getId()),
    createShape("smallSquare", 3, 1, getId()),
    createShape("smallSquare", 3, 2, getId()),
    createShape("smallSquare", 4, 3, getId()),
    createShape("bigSquare", 0, 1),
    createShape("horizontalRect", 2, 1, getId()),
    // createShape("verticalRect", 0, 0, getId()),
    // createShape("verticalRect", 2, 0, getId()),
    createShape("verticalRect", 0, 3, getId()),
    createShape("verticalRect", 2, 3, getId()),
  ]);

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

          return { ...piece, coordinates: newCoords };
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

          return { ...piece, coordinates: newCoords };
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

          return { ...piece, coordinates: newCoords };
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

          return { ...piece, coordinates: newCoords };
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
  const [gameWin, setGameWin] = useState<boolean>(false);

  checkWin(board);

  return (
    <>
      {boardError.error ? (
        <div className="boardError">
          <h1>{boardError.msg}</h1>
        </div>
      ) : (
        <>
          <div className="board">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  className={` ${cell === null ? "blank" : "piece " + cell.type}`}
                  draggable={cell === null ? false : true}
                  data-m={rowIndex}
                  data-n={colIndex}
                  onDragStart={
                    cell !== null
                      ? (e: React.DragEvent<HTMLDivElement>) => {
                          const img = new Image();
                          img.src = "";
                          e.dataTransfer?.setDragImage(img, 0, 0);
                          setCurrentPieceId(cell.id);
                        }
                      : undefined
                  }
                  onDragEnd={
                    cell !== null
                      ? () => {
                          setCurrentPieceId(null);
                        }
                      : undefined
                  }
                  onDragEnter={
                    cell === null
                      ? (e: React.DragEvent<HTMLDivElement>) => {
                          if (currentPieceId === null) return;
                          const element = e.target as HTMLElement;
                          const m = Number(element.dataset.m);
                          const n = Number(element.dataset.n);

                          const direction = getDirection(currentPieceId, m, n);
                          if (direction === undefined) return;
                          handlePieceSlide(currentPieceId, direction);
                        }
                      : undefined
                  }
                  key={colIndex}
                ></div>
              )),
            )}
          </div>
          {gameWin ? <Win levelFunction={changeLevel} /> : null}
        </>
      )}
    </>
  );
}

export default Board;
