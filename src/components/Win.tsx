import "../styles/Win.css";
interface WinProps {
  levelFunction: (direction: "next" | "prev") => void;
}
function Win({ levelFunction }: WinProps) {
  return (
    <>
      <div className="winContainer">
        <div className="winMessage">
          <h2>You Win!</h2>
          <div className="winBtns">
            <button className="arrowBtn" onClick={() => levelFunction("prev")}>
              Prev Level
            </button>
            <button className="playAgainBtn">Play Again</button>
            <button className="arrowBtn" onClick={() => levelFunction("next")}>
              Next Level
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Win;
