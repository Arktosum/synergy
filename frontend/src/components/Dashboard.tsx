import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/authSlice";
import { fetchUserbyId } from "../features/userSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const user_id = useAppSelector((state) => state.auth.user_id);
  const user = useAppSelector((state) => state.user.user);
  const socket = useAppSelector((state) => state.auth.socket);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) navigate("/");
    if (user_id) dispatch(fetchUserbyId(user_id));
  }, [dispatch, navigate, token, user_id]);

  useEffect(() => {
    socket?.off().on("receive-message", (receivedMessage: string) => {
      console.log("Recieved", receivedMessage);
    });
  }, [socket]);

  async function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }
  function handleMessage(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }
  function sendMessage() {
    socket?.emit("send-message", message);
    setMessage("");
  }
  return (
    <div>
      <div>{user?.username}</div>
      <div>{user?.email}</div>
      <div>{user?.password}</div>
      <div>
        <input type="text" value={message} onChange={handleMessage} />
        <button onClick={sendMessage}>Send!</button>
      </div>
      <div onClick={handleLogout} className="px-5 py-2 bg-red-500">
        Logout
      </div>
    </div>
  );
}
