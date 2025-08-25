import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Board from "./components/Board.tsx";
import Test from "./components/Test.tsx";

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Board />} />

      <Route path="/test" element={<Test />} />
    </Routes>
  </BrowserRouter>
}

export default App;
