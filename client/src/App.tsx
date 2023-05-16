import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products"></Route>
    </Routes>
  );
}

export default App;
