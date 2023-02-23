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
      avatarUrl: "",
      connections: JSON.stringify({}),
    };
    POST("/api/users/read", { username: schemaData.username }, (data) => {
      if (data.length > 0) {
        // User already exists
        alert("user already exists!");
        return;
      } 
      POST("/api/users/add", schemaData,()=>{
        POST("/api/users/read",{"username" : schemaData.username},(data)=>{
          localStorage.setItem("user-data", JSON.stringify(data[0]._id));
          navigate("/chat");
          alert("User added successfully!");
        })
      });
    });
    e.target.reset();
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <div style={{ display: "flex", flexDirection: "column" }}>
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

          <button className="">Submit</button>
          <div>
            Already have an account? <Link to="/">Login now!</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
