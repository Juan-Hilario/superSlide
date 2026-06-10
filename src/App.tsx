import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import Board from "./components/Board.tsx";
import Test from "./components/Test.tsx";
import Menu from "./components/menu/Menu.tsx";

function App() {
  const [screen, setScreen] = useState<"menu" | "game">("menu");
  if (screen === "menu") return <Menu onPlay={() => setScreen("game")} />;
  if (screen === "game") return <Board onExit={() => setScreen("menu")} />;

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/super-slide" element={<Menu />} /> */}

        {/* <Route path="/super-slide/test" element={<Test />} /> */}
        {/* <Route path="/super-slide/menu" element={<Menu />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
