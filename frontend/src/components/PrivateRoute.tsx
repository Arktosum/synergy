import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function PrivateRoute() {
  const auth = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <>
      <div>PrivateRoute</div>
      <Outlet />
    </>
  );
}
