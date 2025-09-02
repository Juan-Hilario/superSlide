import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Board from "./components/Board.tsx";
import Test from "./components/Test.tsx";
import Menu from "./components/menu/Menu.tsx";

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Board />} />

      <Route path="/test" element={<Test />} />
      <Route path="/menu" element={<Menu />} />
    </Routes>
  </BrowserRouter>
}

export default App;
