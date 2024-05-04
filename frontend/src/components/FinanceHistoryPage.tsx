import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { Link } from "react-router-dom";
import { homeIcon, userIcon, historyIcon, deleteIcon } from "../app/assets";
import {
  deleteTransaction,
  fetchAllTransactions,
  FinanceUser,
  Transaction,
} from "../features/financeSlice";
import moment from "moment";

export default function FinanceHistoryPage() {
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    dispatch(fetchAllTransactions()).then((response) => {
      setTransactions(response.payload as Transaction[]);
    });
  }, [dispatch]);

  async function handleDeleteTransaction(item_id: string | undefined) {
    if (!item_id) return;
    const choice = prompt("Are you sure you want to delete? y/n");
    if (choice?.toLocaleLowerCase() != "y") return;
    const response = await dispatch(deleteTransaction(item_id));
    if (response.meta.requestStatus == "fulfilled") {
      setTransactions((prev) => {
        return prev.filter((item) => item._id != item_id);
      });
    }
  }

  let BALANCE = 0;

  const transactionElements = transactions.map((item) => {
    const user = item.transactee as unknown as FinanceUser;
    const is_sending = item.mode == "SEND";
    BALANCE += item.amount * (is_sending ? -1 : 1);
    return (
      <div
        key={item._id}
        className="grid grid-cols-4 mx-5 p-5 bg-[#171717] rounded-xl"
      >
        <div className=" col-span-3 flex flex-col justify-center gap-5">
          <div className="font-bold">{user.transactee}</div>
          <div className="text-sm text-gray-600">
            {moment(item.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className=" flex flex-col justify-center gap-5 items-center">
          <div className={is_sending ? "text-red-600" : "text-green-600"}>
            <span>{is_sending ? "-" : "+"}</span>$ {Math.abs(item.amount)}
          </div>
          <div
            className="text-red-600"
            onClick={() => {
              handleDeleteTransaction(item._id);
            }}
          >
            {deleteIcon}
          </div>
        </div>
      </div>
    );
  });
  const theRed = BALANCE < 0;
  return (
    <div className="h-[100dvh] bg-black flex flex-col items-center justify-center">
      <div className="top-nav h-[10%] w-full flex p-2 gap-5 bg-[#171717]">
        <Link to="/">
          <img src={"/logo.svg"} alt="" className="w-20" />
        </Link>
      </div>
      <div className="text-center text-xl p-5 font-bold text-white">
        Balance <span className="text-green-600">|</span>{" "}
        <span className={theRed ? "text-red-600" : "text-green-300"}>
          {theRed ? "-" : "+"} ${Math.abs(BALANCE)}
        </span>
      </div>
      <div className="content w-full h-[10%] flex-1 text-white flex flex-col gap-2 overflow-y-auto">
        {transactionElements}
      </div>
      <div className="bottom-nav h-[10%] w-full bg-[#171717] text-white flex justify-evenly items-center">
        <Link to="/dashboard">
          <div className="bg-[#0e0e0e] p-5 rounded-full">{homeIcon}</div>
        </Link>
        <Link to="/finance">
          <div className="bg-[#0e0e0e] p-5 rounded-full">{userIcon}</div>
        </Link>
        <Link to="/finance/history">
          <div className="bg-[#414141] p-5 rounded-full">{historyIcon}</div>
        </Link>
      </div>
    </div>
  );
}
