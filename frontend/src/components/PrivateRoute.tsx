import { Navigate, Outlet } from "react-router-dom";
import { isAuthorized } from "../features/userSlice";

// export default function PrivateRoute({ children }: React.PropsWithChildren) {
//   const authorized = isAuthorized();
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!authorized) {
//       navigate("/login", { replace: true });
//     }
//   }, [authorized, navigate]);
//   return children;
// }

export default function PrivateRoute() {
  const authorized = isAuthorized();
  return authorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}
