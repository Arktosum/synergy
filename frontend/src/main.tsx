import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

import Dashboard from "./components/Dashboard.tsx";
import Login from "./components/Login.tsx";
import React from "react";
import ErrorPage from "./components/ErrorPage.tsx";
import { PrivateRoute } from "./components/PrivateRoute.tsx";
import { Root } from "./components/Root.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      {/* Invalid routes */}
      <Route path="*" element={<ErrorPage />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
