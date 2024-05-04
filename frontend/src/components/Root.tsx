import { Outlet } from "react-router-dom";
// import { isAuthorized } from "../features/userSlice";
// import { PropsWithChildren, useEffect } from "react";

// export default function Landing({ children }: PropsWithChildren) {
//   const authorized = isAuthorized();
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (authorized) {
//       navigate("/dashboard", { replace: true });
//     } else {
//       navigate("/login", { replace: true });
//     }
//   }, [authorized, navigate]);

//   return children;
// }

export default function Layout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
