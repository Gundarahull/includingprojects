import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manger from "./components/Manger";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Manger />
    </>
  );
}

export default App;
