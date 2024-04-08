import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/authSlice";
import {
  fetchUserbyId,
  fetchUserbyUsernameRegex,
  User,
} from "../features/userSlice";

import io from "socket.io-client";

export const socket = io("http://localhost:5000");

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user_id = useAppSelector((state) => state.auth.user_id);
  const current_user = useAppSelector((state) => state.user.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user_id) navigate("/");
    else dispatch(fetchUserbyId(user_id));
  }, [dispatch, navigate, user_id]);

  useEffect(() => {
    socket.on("receive-message", (receivedMessage: string) => {
      console.log("Recieved", receivedMessage);
    });
    return () => {
      socket.off("receive-message");
    };
  }, []);

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
    <div className="min-h-screen bg-black flex">
      <div className="border-2 border-red-600 w-[10%]">
        {/* ServerSideNav */}
      </div>
      <div className="border-2 border-blue-600 w-[20%]">
        <ConversationNavbar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <div className="border-2 border-green-600 w-[50%]">
        <Content />
      </div>
      <div className="border-2 border-yellow-600 w-[20%]">
        {/* Extra Right Nav */}
      </div>
      <div className="bg-red-600 text-white" onClick={handleLogout}>
        LOGOUT
      </div>
    </div>
  );
}

function ConversationNavbar({ selectedUser, setSelectedUser }) {
  const dispatch = useAppDispatch();
  const [searchUsername, setSearchUsername] = useState("");
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  useEffect(() => {}, []);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const username = e.target.value;
    setSearchUsername(username);
    if (username == "") {
      setSearchUsers([]);
      return;
    }
    try {
      const users = await dispatch(fetchUserbyUsernameRegex(username)).unwrap();
      setSearchUsers(users);
    } catch (err) {
      console.error(err);
    }
    setSearchUsername(username);
  }

  return (
    <>
      <div className="text-xl text-white">Conversations</div>
      <div>
        <input
          type="text"
          value={searchUsername}
          className="bg-black text-white border-2 border-white"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-5">
        {searchUsers.map((user) => {
          return (
            <div
              key={user._id}
              className={`text-white flex items-center gap-5 mx-auto ${
                selectedUser && user._id == selectedUser._id
                  ? "bg-green-600"
                  : ""
              }`}
              onClick={() => {
                setSelectedUser(user);
              }}
            >
              <img src={user.profilePicture} width={50} alt="" />
              <div className="text-white">{user.username}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
function Content({ selectedUser, setSelectedUser }) {
  if (!selectedUser) return;
  return (
    <>
      <div className="text-white">{selectedUser.username}</div>
    </>
  );
}
