import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST } from "./Utils";

export default function Login() {
  let navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user-data"));
  useEffect(() => {
    if (user != null) {
      navigate("/chat");
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let data = Object.fromEntries(formData);
    POST(
      "/api/users/read",
      { username: data.username, password: data.password },
      (allUsers) => {
        if (allUsers.length == 0) {
          alert("Invalid credentials!");
          return;
        }
        localStorage.setItem("user-data", JSON.stringify(allUsers[0]._id));
        navigate("/chat");
      }
    );
    e.target.reset();
  }
  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid grid-cols-2 gap-5 bg-gray-600 px-10 py-20 rounded-xl">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="p-2 rounded-xl text-black focus:outline-none cursor-pointer duration-200 focus:ring-purple-600"
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            className="p-2 rounded-xl text-black focus:outline-none cursor-pointer duration-200 focus:ring-purple-600"
            autoComplete="current-password"
          />
          <div className="col-span-2 grid place-content-center gap-y-2">
            <button className="p-5 bg-blue-400 rounded-xl hover:scale-105 cursor-pointer duration-200">
              LOGIN
            </button>
            <div>
              New to Synergy? <Link to="/signup">Signup now!</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
