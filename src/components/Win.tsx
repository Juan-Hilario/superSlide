import "../styles/Win.css";
import { Level } from "./Board";
interface WinProps {
  levelFunction: (option: "again" | "next" | "prev") => void;
  levelNum: number;
  levels: Level[] | [];
}
function Win({ levelFunction, levelNum, levels }: WinProps) {
  return (
    <>
      <div className="winContainer">
        <div className="winMessage">
          <h2>You Win!</h2>
          <div className="winBtns">
            <button
              disabled={levelNum == 0}
              className="arrowBtn"
              onClick={() => levelFunction("prev")}
            >
              Prev Level
            </button>
            <button
              className="playAgainBtn"
              onClick={() => levelFunction("again")}
            >
              Play Again
            </button>
            <button
              disabled={levelNum >= levels.length - 1}
              className="arrowBtn"
              onClick={() => levelFunction("next")}
            >
              Next Level
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Win;
