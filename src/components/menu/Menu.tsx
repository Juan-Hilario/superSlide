import "../../styles/Menu.css";
type MenuProps = {
  onPlay: () => void;
};
function Menu({ onPlay }: MenuProps) {
  const message = "";

  return (
    <>
      <div className="menu">
        {message.length > 0 ? <div className="message"></div> : null}
        <h1>Super Slide</h1>
        <h2>
          made by <a href="https://juanhilario.dev/">Juan Hilario</a>
        </h2>
        <div className="menuBtns">
          <a href="https://juanhilario.dev/">
            <button>Exit</button>
          </a>
          <button onClick={onPlay}>Play</button>
          {/* <button>Options</button> */}
        </div>
        <p>inspired by the physical version of this game</p>
        <a target="_blank" href="https://github.com/juan-hilario/superSlide">
          github
        </a>
      </div>
    </>
  );
}

export default Menu;
