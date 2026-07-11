import { useState, useEffect } from "react";
import { createShape, Shape, ShapeType } from "./Pieces";
import Win from "./Win";
import "../styles/Board.css";

export interface Level {
  shapes: { type: ShapeType; m: number; n: number }[];
  difficulty: string;
}

type BoardProps = {
  onExit: () => void;
};

function Board({ onExit }: BoardProps) {
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

  const smallSquareRendering = (
    <>
      <div className="rendering">
        <svg
          viewBox="0 0 105 105"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "square",
            strokeMiterlimit: 1.5,
          }}
          width="100%"
          height="100%"
        >
          <path
            d="M227.987 45A27.013 27.013 0 0 1 255 72.013v155.974A27.013 27.013 0 0 1 227.987 255H72.013A27.013 27.013 0 0 1 45 227.987V72.013A27.013 27.013 0 0 1 72.013 45z"
            style={{
              fill: "#f0df00",
            }}
            transform="matrix(.5 0 0 .5 -22.5 -22.5)"
          />
          <path
            d="M245.771 248.32 51.68 54.229q.593-.677 1.232-1.317a27 27 0 0 1 4.095-3.36l193.441 193.441a27 27 0 0 1-4.677 5.327"
            style={{
              fill: "#e4cb22",
            }}
            transform="matrix(.5 0 0 .5 -22.5 -22.5)"
          />
          <path
            d="M241.45 48.594a27 27 0 0 1 5.638 4.318l.024.024L52.936 247.112l-.024-.024a27 27 0 0 1-4.318-5.638z"
            style={{
              fill: "#e4cb22",
            }}
            transform="matrix(.5 0 0 .5 -22.5 -22.5)"
          />
          <circle
            cx={520}
            cy={164}
            r={47}
            style={{
              fill: "#e4cb22",
              stroke: "#e4cb22",
              strokeWidth: "3.36px",
            }}
            transform="translate(-237.926 -39.096)scale(.55851)"
          />
          <circle
            cx={520}
            cy={164}
            r={47}
            style={{
              fill: "#f0df00",
              stroke: "#f0df00",
              strokeWidth: "5.6px",
            }}
            transform="translate(-121.142 -2.457)scale(.3351)"
          />
        </svg>
      </div>
    </>
  );
  const bigSquareRendering = (
    <>
      <div className="rendering">
        <svg
          viewBox="0 0 210 211"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5,
          }}
        >
          <path
            d="M241.493 45C248.953 45 255 51.047 255 58.507v182.986c0 7.46-6.047 13.507-13.507 13.507H58.507C51.047 255 45 248.953 45 241.493V58.507C45 51.047 51.047 45 58.507 45z"
            style={{
              fill: "#ec4d4d",
            }}
            transform="translate(-45 -44.348)"
          />
          <path
            d="M252.172 249.765a13.6 13.6 0 0 1-2.405 2.405L196.5 199.928l2.381-2.428zm-204.344 0 53.291-52.265 2.381 2.428-53.267 52.242a13.6 13.6 0 0 1-2.405-2.405"
            style={{
              fill: "#c83535",
            }}
            transform="translate(-45 -44.348)"
          />
          <path
            d="M179.5 90 243 217H116z"
            style={{
              fill: "#c83535",
              stroke: "#c83535",
              strokeWidth: "1.21px",
            }}
            transform="translate(-43.406 -21.258)scale(.82677)"
          />
          <path
            d="M179.5 90 243 217H116z"
            style={{
              fill: "#ec4d4d",
              stroke: "#c83535",
              strokeWidth: "3.26px",
            }}
            transform="translate(49.878 68.466)scale(.30709)"
          />
          <path
            d="M150 97.5V45"
            style={{
              fill: "none",
              stroke: "#c83535",
              strokeWidth: "3.38px",
              strokeLinecap: "square",
            }}
            transform="matrix(1 0 0 1.20952 -45 -51.777)"
          />
        </svg>
      </div>
    </>
  );
  const horizontalRectRendering = (
    <>
      <div className="rendering">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 210 105"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "square",
            strokeMiterlimit: 1.5,
          }}
        >
          <path
            d="M241.493 45c3.583 0 7.018 2.846 9.551 7.912S255 64.849 255 72.013v155.974c0 7.164-1.423 14.035-3.956 19.101S245.076 255 241.493 255H58.507c-3.583 0-7.018-2.846-9.551-7.912S45 235.151 45 227.987V72.013c0-7.164 1.423-14.035 3.956-19.101S54.924 45 58.507 45z"
            style={{
              fill: "#355fe7",
            }}
            transform="matrix(1 0 0 .5 -45 -22.5)"
          />
          <path
            style={{
              fill: "#1439b2",
            }}
            transform="matrix(-42 0 0 -1.17896 15624 326.608)"
            d="M367 231h5v3h-5z"
          />
          <path
            d="M197 409.75v17.5c0 4.829-5.881 8.75-13.125 8.75H72.125C64.881 436 59 432.079 59 427.25v-17.5c0-4.829 5.881-8.75 13.125-8.75h111.75c7.244 0 13.125 3.921 13.125 8.75"
            style={{
              fill: "#1439b2",
            }}
            transform="matrix(1 0 0 1.5 -23 -575.25)"
          />
          <path
            d="M197 409.75v17.5c0 4.829-3.551 8.75-7.926 8.75H66.926c-4.375 0-7.926-3.921-7.926-8.75v-17.5c0-4.829 3.551-8.75 7.926-8.75h122.148c4.375 0 7.926 3.921 7.926 8.75Z"
            style={{
              fill: "#355fe7",
              stroke: "#355fe7",
              strokeWidth: "1.3px",
            }}
            transform="matrix(.80435 0 0 .72857 2.043 -252.407)"
          />
        </svg>
      </div>
    </>
  );
  const verticalRectRendering = (
    <>
      <div className="rendering">
        <svg
          viewBox="0 0 105 210"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "square",
            strokeMiterlimit: 1.5,
          }}
        >
          <path
            d="M241.493 45c3.583 0 7.018 2.846 9.551 7.912S255 64.849 255 72.013v155.974c0 7.164-1.423 14.035-3.956 19.101S245.076 255 241.493 255H58.507c-3.583 0-7.018-2.846-9.551-7.912S45 235.151 45 227.987V72.013c0-7.164 1.423-14.035 3.956-19.101S54.924 45 58.507 45z"
            style={{
              fill: "#38c946",
            }}
            transform="matrix(0 1 -.5 0 127.5 -45)"
          />
          <path
            d="M197 409.75v17.5c0 4.829-5.881 8.75-13.125 8.75H72.125C64.881 436 59 432.079 59 427.25v-17.5c0-4.829 5.881-8.75 13.125-8.75h111.75c7.244 0 13.125 3.921 13.125 8.75"
            style={{
              fill: "#41a14a",
            }}
            transform="matrix(0 1 -1.5 0 680.25 -23)"
          />
          <path
            style={{
              fill: "#41a14a",
            }}
            transform="matrix(0 -42 1.17896 0 -221.608 15624)"
            d="M367 231h5v3h-5z"
          />
          <path
            d="M197 409.75v17.5c0 4.829-3.551 8.75-7.926 8.75H66.926c-4.375 0-7.926-3.921-7.926-8.75v-17.5c0-4.829 3.551-8.75 7.926-8.75h122.148c4.375 0 7.926 3.921 7.926 8.75Z"
            style={{
              fill: "#38c946",
              stroke: "#38c946",
              strokeWidth: "1.3px",
            }}
            transform="matrix(0 .80435 -.72857 0 357.407 -.957)"
          />
        </svg>
      </div>
    </>
  );

  const renderingMap: Record<string, JSX.Element> = {
    smallSquare: smallSquareRendering,
    bigSquare: bigSquareRendering,
    horizontalRect: horizontalRectRendering,
    verticalRect: verticalRectRendering,
  };

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
                      The goal of the game is to get the big red square into the
                      bottom center of the board, marked in light gray.
                    </li>
                    <li>
                      {" "}
                      To slide the peices around you can drag them with your
                      mouse to an empty space. A piece will only move if there
                      is enough space for it to move.
                    </li>
                    <li>
                      There are only {levels.length} levels at this point, with
                      many more levels to come. All levels are possible.{" "}
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

              <div className="board">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isOrigin =
                      cell !== null &&
                      cell.origin.m === rowIndex &&
                      cell.origin.n === colIndex;

                    return (
                      <div className="space">
                        <div
                          className={` ${cell === null ? "blank" : "piece " + cell.type} `}
                          id={`cell-${rowIndex}-${colIndex}`}
                          data-m={rowIndex}
                          data-n={colIndex}
                          data-origin-m={`${cell ? cell.origin.m.toString() : null}`}
                          data-origin-n={`${cell ? cell.origin.n.toString() : null}`}
                          onMouseDown={
                            cell !== null
                              ? () => handleGrab(cell.id)
                              : undefined
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
            </div>
            {gameWin ? (
              <Win
                levelFunction={changeLevel}
                levelNum={levelNum}
                levels={levels}
              />
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

export default Board;
