import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { POST } from "./Utils";

export default function Main() {
  let user_id = JSON.parse(localStorage.getItem("user-data"));
  let navigate = useNavigate()
  let [renderState, render] = useState(false);
  let [currentUser,setcurrentUser] = useState(null);
  let [MyConnections,setMyConnections] = useState(null)
  let [selectedUser,setselectedUser] = useState(null)
  let [messages,setMessages] = useState([])
  function rerender() {
    setTimeout(() => {
      render((prev) => !prev);
    }, 300);
  }

  const socket = io("https://Synergy.blazingknightog.repl.co");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server.");
      socket.emit('add-user',user_id)
      socket.on('receiveMessage',(message)=>{
        setMessages(prev => [...prev,message])
        rerender()
      })
    });
    POST('/api/users/read',{_id : user_id},(user)=>{
      setcurrentUser(user[0]);
    })
  }, []);
  useEffect(()=>{
    if(currentUser== null)return;
    POST('/api/users/read',{
      "_id" : {
        "$in" : currentUser.connections
      }
    },(users)=>{
      setMyConnections(users)
    })
  },[currentUser,renderState])
  function Logout(){
    navigate('/')
    localStorage.removeItem('user-data');
    alert("Logged out successfully!");
  }
  function addConnection(e){
    e.preventDefault();
    let formData = Object.fromEntries(new FormData(e.target));
    let username = formData.username
    // Check if username actually exists
    POST("/api/users/read",{username:username},(user)=>{
      if(user.length == 0){
        alert("Username not found!");
        return;
      }
      else{
          user = user[0]
          currentUser.connections.push(user._id)
          currentUser['id'] = {_id : currentUser._id}
          POST('/api/users/update',currentUser,(success)=>{
            if(!success){alert("Something went wrong!");return;}
              alert("Added a connection!")
              rerender()
          })
        }
      });
    e.target.reset()
  }
  function sendMessage(e){
    e.preventDefault();
    let options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    };
    let timestamp = new Intl.DateTimeFormat("en-in", options).format(new Date());

    let formData = Object.fromEntries(new FormData(e.target));
    let message = formData.message
    if(selectedUser == null){
      alert("Select a user to message!");
      return;
    }
    let messageObj = {
      message : message,
      from : user_id,
      to : selectedUser,
      timestamp:timestamp
    }
    socket.emit("sendMessage", messageObj)
    POST('/api/messages/add', messageObj)
    setMessages(prev => [...prev,messageObj])
    rerender()
    e.target.reset();
  }
  if(currentUser == null) return <></>;
  return (<>
  <div className="min-h-screen bg-black">
  <div className="flex p-5 justify-between items-center bg-gray-600">
    <div className="flex justify-center items-center gap-5">
      <div className=""><img src={currentUser.avatarUrl} alt="" className="w-20 h-20 rounded-full bg-green-600 border-black border-2 hover:scale-125 duration-200 cursor-pointer"/></div>
      <div className="text-white text-xl">Logged in as,<span className="text-green-600">{currentUser.username}</span></div>
    </div>
    <button className="text-xl text-red-600 hover:scale-125 duration-200" onClick={()=>{Logout()}}>Logout</button>
  </div>
  <div>
    <div className="text-white">My Friends</div>
    {MyConnections != null ? MyConnections.map((user)=>{
      return (
      <div className="flex justify-start items-center gap-5 text-white cursor-pointer w-fit" key={user._id} onClick={()=>{
        setselectedUser(user._id);
        POST('/api/messages/read',{})
        alert("Selected user: " + user.username);
      }}>
        <div className=""><img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full bg-green-600 border-black border-2 hover:scale-125 duration-200 cursor-pointer" /></div>
        <div>{user.username}</div>
        </div>)
    }) : <></>}
    {/* Here lies my friends */}
  </div>
  <div className="text-white text-2xl">Chat</div>
  <div className="bg-gray-800 p-5 h-[50vh] w-[50vh] overflow-y-scroll flex flex-col gap-5">
    {messages.map((message)=>{
      return (<Message key={Math.random()*1000000}  props={{message:message,currentUser,selectedUser}}/>)
    })}
  </div>
  <form onSubmit={addConnection}>
    <label htmlFor="add"className="text-white">Add Connection</label>
    <input type="text" className="p-2" name="username"/>
    <button className="p-2 bg-green-600 rounded-full">Add</button>
  </form>

  <form onSubmit={sendMessage}>
    <label htmlFor="add"className="text-white">SendMessage</label>
    <input type="text" className="p-2" name="message"/>
    <button className="p-2 bg-green-600 rounded-full">Add</button>
  </form>
  </div>
  </>)
}



function Message({message,currentUser,selectedUser}){
  // True if my message, false if their message
  console.log(message)
  let my_message = message.from == currentUser._id
  return (<div className={`flex justify-start ${my_message?'flex-row-reverse':''} items-center bg-lime-500 p-3 rounded-xl gap-5`}>
  <div className=""><img src={my_message?currentUser.avatarUrl:selectedUser.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-green-600 border-black border-2 hover:scale-125 duration-200 cursor-pointer"/></div>
  <div>{message.message}</div>
</div>)
}

// User:
// {
//   _id : _id
//   connections : [_id1,_id2.......]
//   dm : [couple1,couple2]
//   groups : [chatgroup_1,chat_group_2]
// }


// Message

// {
//   _id : _id
//   message: 
//   from : _id // Required by me
//   to : _id  // required by socket
//   chatRoom // required to fetch
//   timestamp:
// }


// ChatRoom
// {
//  _id : _id,
//  users : [_id,_id,_id]
//  }