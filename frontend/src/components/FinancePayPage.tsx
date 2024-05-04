import { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  fetchUserById,
  FinanceUser,
  payFinanceUser,
  Transaction,
  TransactionCategory,
} from "../features/financeSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { historyIcon, homeIcon, userIcon } from "../app/assets";

export default function FinancePayPage() {
  const params = useParams();
  const PAY_USER_ID = params.id;
  const [payUser, setpayUser] = useState<FinanceUser>();

  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<Transaction>({
    transactee: "",
    amount: 0,
    status: "UNPAID",
    category: "FOOD",
    mode: "SEND",
  });
  const is_sending = transactionData.mode === "SEND";
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!PAY_USER_ID) return;
    dispatch(fetchUserById(PAY_USER_ID)).then((response) => {
      const user = response.payload as FinanceUser;
      setpayUser(user);
      setTransactionData((prev) => {
        const id = user._id;
        if (id) return { ...prev, transactee: id };
        else return { ...prev, transactee: "" };
      });
    });
  }, [PAY_USER_ID, dispatch]);

  async function handlePayment() {
    const response = await dispatch(payFinanceUser(transactionData));
    if (response.meta.requestStatus == "fulfilled") {
      navigate("/finance/history");
    }
  }
  return (
    <div className="h-[100dvh]  bg-black flex flex-col items-center justify-center">
      <div className="top-nav  h-[10%] w-full flex p-2 gap-5 bg-[#171717]">
        <img src={"/logo.svg"} alt="" className="" />
      </div>
      <div className="content w-full flex-1 text-white flex flex-col gap-5 ">
        <div className="flex justify-around items-center">
          <div
            className="flex gap-5 items-center py-2"
            onClick={() => {
              setTransactionData((prev) => {
                return {
                  ...prev,
                  mode: is_sending ? "RECEIVE" : "SEND",
                };
              });
            }}
          >
            <span
              className={
                is_sending ? "text-xl" : "line-through text-gray-600 text-md"
              }
            >
              Sending
            </span>
            |
            <span
              className={
                is_sending
                  ? "line-through text-gray-600 text-md"
                  : "text-xl text-white"
              }
            >
              Receiving
            </span>
          </div>

          <select
            name=""
            id=""
            className="bg-inherit text-white p-5"
            onChange={(e) => {
              setTransactionData((prev) => {
                return {
                  ...prev,
                  category: (e.target.value as TransactionCategory) || "OTHER",
                };
              });
            }}
          >
            <option value="FOOD">FOOD</option>
            <option value="TRANSPORT">TRANSPORT</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="GROOMING">GROOMING</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div className="text-xl font-bold px-5">{payUser?.transactee}</div>
        <div className="flex items-center justify-center">
          <div
            className={`text-5xl ${
              is_sending ? "text-red-600" : "text-green-600"
            }`}
          >
            <span>{is_sending ? "-" : "+"}</span> $
          </div>
          <input
            value={transactionData.amount == 0 ? "" : transactionData.amount}
            type="number"
            placeholder="0"
            onChange={(e) => {
              if (e.target.value == "") e.target.value = "0";
              setTransactionData((prev) => {
                return { ...prev, amount: parseInt(e.target.value) };
              });
            }}
            className="text-center w-[40%] appearance-none bg-inherit self-center text-5xl font-bold focus:outline-none"
          />
        </div>

        <textarea
          name=""
          id=""
          placeholder="Remarks..."
          className="bg-inherit appearance-none self-center my-5 text-sm text-gray-400"
          onChange={(e) => {
            setTransactionData((prev) => {
              return { ...prev, remarks: e.target.value };
            });
          }}
        ></textarea>
        <button
          className="font-bold border-green-600 border-2 px-5 py-2 w-[50%] self-center rounded-xl animate-bounce hover:bg-green-600 hover:text-black duration-200 ease-in-out"
          onClick={handlePayment}
        >
          PAY
        </button>
      </div>
      <div className="bottom-nav h-[10%] w-full bg-[#171717] text-white flex justify-evenly items-center">
        <Link to="/dashboard">
          <div className="bg-[#0e0e0e] p-5 rounded-full">{homeIcon}</div>
        </Link>
        <div className="bg-[#0e0e0e] p-5 rounded-full">{userIcon}</div>
        <div className="bg-[#0e0e0e] p-5 rounded-full">{historyIcon}</div>
      </div>
    </div>
  );
}
