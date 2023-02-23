import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Main from "./Components/Main";
import Signup from "./Components/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/chat" element={<Main />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </>
  );
}

export default App;
