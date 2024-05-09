import { Navigate  } from "react-router-dom";
import { isAuthorized } from "../features/userSlice";

export function PrivateRoute({children} : React.PropsWithChildren){
  const authorized = isAuthorized();
  return authorized? children : <Navigate to="/"/>
}
