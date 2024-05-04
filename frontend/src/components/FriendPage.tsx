import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { homeIcon, userIcon, historyIcon } from "../app/assets";
import {
  fetchAllFriends,
  fetchFriendsRegex,
  Friend,
} from "../features/friendSlice";
import moment from "moment";

const GENDER_IMG_MAP = {
  MALE: {
    placeholder: "",
    sign: "/male-sign.svg",
  },
  FEMALE: {
    placeholder: "",
    sign: "/female-sign.svg",
  },
  OTHER: {
    placeholder: "",
    sign: "/other-sign.svg",
  },
};

export default function FinancePage() {
  const [searchUserName, setsearchUserName] = useState("");
  const [searchedUsers, setsearchedUsers] = useState<Friend[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchUserName == "") {
      dispatch(fetchAllFriends()).then((response) => {
        setsearchedUsers(response.payload as Friend[]);
      });
    }
  }, [dispatch, searchUserName]);

  async function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newSearchUsername = e.target.value;
    if (newSearchUsername == "") {
      setsearchUserName("");
      return;
    }
    setsearchUserName(newSearchUsername.toUpperCase());

    const response = await dispatch(
      fetchFriendsRegex(newSearchUsername.toUpperCase())
    );
    if (response.meta.requestStatus == "fulfilled") {
      setsearchedUsers(response.payload as Friend[]);
    }
  }

  const searchUserElements = searchedUsers.map((item) => {
    return (
      <div
        onClick={() => {
          navigate(`/friend/${item._id}`);
        }}
        key={item._id}
        className="flex flex-col gap-5 p-5 border-black border-b-green-600 border-2  bg-[#111111] hover:bg-[#262626] duration-200 ease-in-out"
      >
        <div className="text-white">
          <img src={item.displayImage} alt="" />
        </div>
        <div className="flex ">
          <div className="flex flex-col w-full items-start justify-between ">
            <div className="text-white font-bold">{item.username}</div>
            <div className="text-gray-600 text-sm">{item.description}</div>
            <div className="text-white">
              🎂 {moment(item.dateOfBirth).format("MMM do, yyyy")}
            </div>
          </div>
          <img
            src={GENDER_IMG_MAP[item.gender].sign}
            alt=""
            className="w-5 h-5"
          />
        </div>
      </div>
    );
  });

  return (
    <div className="h-[100dvh] bg-black flex flex-col items-center justify-center">
      <div className="top-nav w-full h-[10%] flex justify-between p-2 gap-5 bg-[#171717]">
        <Link to="/">
          <img src={"/logo.svg"} alt="" className="w-20" />
        </Link>
        <input
          value={searchUserName}
          type="text"
          id="regex"
          name="regex"
          placeholder="Search Friends!"
          onChange={handleInput}
          className=" px-5 w-full  bg-[#222222] py-3 self-center rounded-3xl text-white text-sm"
        />
      </div>

      <div className="content w-full h-[10%]  flex-1 text-white flex flex-col gap-5 overflow-y-auto">
        {searchUserElements}
      </div>
      <div className="bottom-nav h-[10%] w-full bg-[#171717] text-white flex justify-evenly items-center">
        <Link to="/dashboard">
          <div className="bg-[#0e0e0e] p-5 rounded-full">{homeIcon}</div>
        </Link>
        <Link to="/finance">
          <div className="bg-[#414141] p-5 rounded-full">{userIcon}</div>
        </Link>
        <Link to="/finance/history">
          <div className="bg-[#0e0e0e] p-5 rounded-full">{historyIcon}</div>
        </Link>
      </div>
    </div>
  );
}
