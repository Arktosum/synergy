import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { POST } from "./Utils";

export default function Main() {
  let user_id = JSON.parse(localStorage.getItem("user-data"));
  let [currentUser,setCurrentUser] = useState(null)
  let [selectedUser, setSelectedUser] = useState(null);
  let [connectedUsers, setConnectedUsers] = useState([]);

  const socket = io("http://localhost:3000");
  useEffect(()=>{
    POST('/api/users/read',{id_:user_id},(data)=>{
      setCurrentUser(data[0])
    })
  },[])
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("add-user", user_id);
      socket.on("receiveMessage", (message) => {
        let stringifiedMessage = JSON.stringify(message);
        console.log(message)
        // add the message to both the sender and receivers connection

        // Receiver Connection
  
      });
    });

    let queryObject = {
      _id: {
        $in: [],
      },
    };
    if(currentUser == null){return;}
    let user_connections = JSON.parse(currentUser.connections)
    
    for(let user_id in user_connections){
      queryObject._id.$in.push(user_id);
    }
    POST("/api/users/read", queryObject, (data) => {
      setConnectedUsers(data);
    });
  }, [currentUser]);
  
  function sendMessage(e) {
    const formData = new FormData(e.target);
    let data = Object.fromEntries(formData);
    if (selectedUser == null) {
      alert("Select a User first!");
      return;
    }
    socket.emit("sendMessage", {
      message: data.message,
      from: user_id,
      to: selectedUser,
    });
  }
  let navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("user-data");
    navigate("/");
  }
  function addConnection(e) {
    const formData = new FormData(e.target);
    let data = Object.fromEntries(formData);
    if (data.username == currentUser.username) {
      alert("You can't add yourself as a connection!");
      return;
    }
    POST("/api/users/read",{ username: data.username},(connectedUser) => {
        if (connectedUser.length == 0) {
          alert("User does not exist!");
          return;
        }
        connectedUser = connectedUser[0]
        let connections = JSON.parse(currentUser.connections);
        connections[connectedUser._id] = []
        currentUser.connections = JSON.stringify(connections)
        let query = {_id : currentUser._id}
        currentUser['id'] = query
        POST('/api/users/update',currentUser)
        alert("Successfully added a connection!");
      }
    );
  }

  let connections = connectedUsers.map((item) => {
    return (
      <div
        key={item._id}
        onClick={() => {
          setSelectedUser(item._id);
          alert(`User ${item.username} selected!`);
        }}
      >
        {item.username}
      </div>
    );
  });

  if(currentUser==null){
    return <></>
  }
  return (
    
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Main</div>
        <div>Logged in as, {currentUser.username}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>{connections}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "lightblue",
          border: "1px solid gray",
          minHeight: "50vh",
        }}
      >
        <div className="message-container"></div>
        <div className="message-input-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(e);
              e.target.reset();
            }}
          >
            <input type="text" name="message" />
            <button>Send message!</button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addConnection(e);
              e.target.reset();
            }}
          >
            <input type="text" name="username" />
            <button>Add Connection!</button>
          </form>
        </div>
      </div>
    </>
  );
}
