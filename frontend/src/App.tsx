// App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import { useAppSelector } from "./app/hooks";
import Signup from "./components/Signup";
import Login from "./components/Login";

const App: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to='/login'/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
