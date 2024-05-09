import { Navigate } from "react-router-dom";
import { isAuthorized } from "../features/userSlice";

export function Root() {
  const authorized = isAuthorized();
  return authorized ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}
