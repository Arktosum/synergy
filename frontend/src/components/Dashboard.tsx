import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authSlice";
import { fetchUserbyId } from "../features/user/userSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const user_id = useAppSelector((state) => state.auth.user_id);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!token) navigate("/");
    if (user_id) dispatch(fetchUserbyId(user_id));
  },[dispatch, navigate, token, user_id]);

  async function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }
  return (
    <div>
      <div>{user?.username}</div>
      <div>{user?.email}</div>
      <div>{user?.password}</div>
      <div onClick={handleLogout} className="px-5 py-2 bg-red-500">
        Logout
      </div>
    </div>
  );
}
