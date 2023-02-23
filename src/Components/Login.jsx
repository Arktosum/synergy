import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST } from "./Utils";

export default function Login() {
  let navigate = useNavigate()
  let user = JSON.parse(localStorage.getItem('user-data'));
  useEffect(()=>{
    if(user !=null){
      navigate('/chat')
    }
  },[])
  
  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let data = Object.fromEntries(formData);
    POST('/api/users/read',{username: data.username, password: data.password},(allUsers)=>{
      if(allUsers.length == 0){
        alert("Invalid credentials!")
        return;
      }
      localStorage.setItem('user-data',JSON.stringify(allUsers[0]._id));
      navigate('/chat')
    })
    e.target.reset();
  }
  return (
    <div>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <div
          style={{
            display: "flex",
            flexDirection:'column',
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" autoComplete="username"/>

          <label htmlFor="password">Password: </label>
          <input type="password" name="password" autoComplete="current-password" />
          <button className="">Submit</button>
          <div>
            New to Synergy? <Link to="/signup">Signup now!</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
