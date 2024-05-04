import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  createFinanceUser,
  fetchRecentUsers,
  fetchUsersByRegex,
  FinanceUser,
} from "../features/financeSlice";
import { Link, useNavigate } from "react-router-dom";
import { addIcon, homeIcon, userIcon, historyIcon } from "../app/assets";

export default function FinancePage() {
  const [searchUserName, setsearchUserName] = useState("");
  const [searchedUsers, setsearchedUsers] = useState<FinanceUser[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchUserName == "") {
      dispatch(fetchRecentUsers()).then((response) => {
        setsearchedUsers(response.payload as FinanceUser[]);
      });
    }
  }, [dispatch, searchUserName]);
  async function handleNewUserCreate() {
    const response = await dispatch(
      createFinanceUser(searchUserName.toUpperCase())
    );
    if (response.meta.requestStatus == "fulfilled") {
      const user = response.payload as FinanceUser;
      navigate(`/finance/${user._id}`);
    }
  }

  async function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newSearchUsername = e.target.value;
    if (newSearchUsername == "") {
      setsearchUserName("");
      return;
    }
    setsearchUserName(newSearchUsername.toUpperCase());

    const response = await dispatch(
      fetchUsersByRegex(newSearchUsername.toUpperCase())
    );
    if (response.meta.requestStatus == "fulfilled") {
      setsearchedUsers(response.payload as FinanceUser[]);
    }
  }

  const searchUserElements = searchedUsers.map((item) => {
    return (
      <div
        onClick={() => {
          navigate(`/finance/${item._id}`);
        }}
        key={item._id}
        className="grid grid-cols-2 w-full place-items-center gap-5 p-5 border-black border-b-green-600 border-2  bg-[#111111] hover:bg-[#262626] duration-200 ease-in-out"
      >
        <div className="text-left">{item.transactee}</div>
        <div>{item.transactions.length}</div>
      </div>
    );
  });

  const duplicate = searchedUsers.filter(
    (item) => item.transactee == searchUserName
  );

  if (searchUserName != "" && duplicate.length == 0) {
    searchUserElements.push(
      <div
        key={searchUserName}
        onClick={handleNewUserCreate}
        className="flex place-items-center gap-5 p-5 border-black border-b-green-600 border-2  bg-[#131313] hover:bg-[#262626] duration-200 ease-in-out"
      >
        {addIcon}
        <div className="text-left">ADD '{searchUserName}'</div>
      </div>
    );
  }

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
          placeholder="Pay Anyone!"
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
