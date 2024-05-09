import {  useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { logoutUser } from "../features/userSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    const response = await dispatch(logoutUser());
    if (response.meta.requestStatus == "fulfilled") navigate("/login");
  }
  return (
    <div className="h-[100dvh] bg-black flex flex-col">
      <button onClick={handleLogout} className="text-red-600">LOGOUT</button>
      <div className="text-white uppercase font-xl">SYNERGY DASHBOARD</div>
      {/* <div className="bottom-nav border-2 border-green-600 h-[10%]"></div> */}
    </div>
  );
}
