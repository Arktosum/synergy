import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Root() {
  const [auth,setAuth] = useState(false);
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
      <div>ROOT</div>
      <button
        onClick={() => {
          setAuth((prev) => !prev);
        }}
      >Toggle</button>
      <Outlet />
    </>
  );
}
