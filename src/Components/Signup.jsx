import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST } from "./Utils.js";

export default function Signup() {
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
    if (data.password != data["retype-password"]) {
      alert("Passwords do not match!");
      return;
    }
    let schemaData = {
      username: data.username,
      password: data.password,
      email: data.email,
      avatarUrl: `https://robohash.org/${data.username}`,
      connections: [],
    };
    POST("/api/users/read", { username: schemaData.username }, (data) => {
      if (data.length > 0) {
        // User already exists
        alert("user already exists!");
        return;
      }
      POST("/api/users/add", schemaData, () => {
        POST("/api/users/read", { username: schemaData.username }, (data) => {
          localStorage.setItem("user-data", JSON.stringify(data[0]._id));
          navigate("/chat");
          alert("User added successfully!");
        });
      });
    });
    e.target.reset();
  }
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <form
        action=""
        onSubmit={(e) => handleSubmit(e)}
        className="h-fit bg-gray-600 w-fit py-10 px-5 rounded-xl flex flex-col"
      >
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" autoComplete="username" />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
        />

        <label htmlFor="password">Retype Password: </label>
        <input
          type="password"
          name="retype-password"
          autoComplete="new-password"
        />

        <label htmlFor="email">Email: </label>
        <input type="text" name="email" />

        <button className="p-5 bg-gray-700 m-5 hover:bg-slate-900 duration-200 hover:scale-105 rounded-xl">Submit</button>
        <div>
          Already have an account? <Link to="/">Login now!</Link>
        </div>
      </form>
    </div>
  );
}
