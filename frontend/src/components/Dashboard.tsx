import { Link, useNavigate } from "react-router-dom";
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
      <div className="top-nav h-[10%] flex justify-between p-2 gap-5 bg-[#171717] mb-5">
        <img src={"/logo.svg"} alt="" className="" />
        <button
          className="px-5 py-2 border-2 border-red-600 text-red-600 rounded-xl"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="content h-[10%] flex-1 text-white flex flex-col gap-5 ">
        <Link to="/finance">
          <div className="bg-[#1c1c1c] p-5 mx-5 rounded-xl font-bold">
            Finances
          </div>
        </Link>
        <Link to="/diary">
          <div className="bg-[#1c1c1c] p-5 mx-5 rounded-xl font-bold">
            Diary
          </div>
        </Link>
        <Link to="/todo">
          <div className="bg-[#1c1c1c] p-5 mx-5 rounded-xl font-bold">Todo</div>
        </Link>
        <Link to="/friend">
          <div className="bg-[#1c1c1c] p-5 mx-5 rounded-xl font-bold">
            Hall of Friends
          </div>
        </Link>
      </div>
      {/* <div className="bottom-nav border-2 border-green-600 h-[10%]"></div> */}
    </div>
  );
}
