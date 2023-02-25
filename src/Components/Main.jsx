import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { POST } from "./Utils";


function fetchUser(user_id,func){
  POST('/api/users/read',{_id : user_id},(data)=>func(data[0]))
}
export default function Main() {
  let user_id = JSON.parse(localStorage.getItem("user-data"));
  
  let [renderState, render] = useState(false);
  let [currentUser,setcurrentUser] = useState(null);
  let [connectedUsers,setconnectedUsers] = useState(null);
  let [selectedUser,setselectedUser] = useState(null);
  let [messages,setMessages] = useState([]);
  console.log("Page rendered")
  const socket = io("http://localhost:3000");
  function rerender() {
    setTimeout(() => {
      render((prev) => !prev);
    }, 500);
  }
  useEffect(()=>{
    socket.on('connect',()=>{
      socket.emit("join-room",user_id) // Joins their own room
      socket.on('receiveMessage',(message) =>{
        setMessages(prev => [...prev, message])
      })
    })
  },[])
    useEffect(()=>{
      fetchUser(user_id,(user)=>{
        setcurrentUser(user);
    })
  },[])
  useEffect(()=>{
    if(currentUser == null) return;
    
    let query = {
      '_id'  :  {
        '$in' : currentUser.connections
      }
    }
    POST('/api/users/read',query,(users)=>{
      setconnectedUsers(users);
      setTimeout(()=>{
        if(users.length > 0){setselectedUser(users[0]);}
      },100)
    })
  },[currentUser])
  if(currentUser==null) return;
  return (
    <>
    <div className="min-h-screen bg-black">
      <Navbar props={{currentUser}}/>
      <div className="flex">
        <div className="p-5 min-w-[50vw]">
          <Contacts props={{currentUser,connectedUsers,setselectedUser,rerender}}/>
        </div>
        <div className="p-5 min-w-[50vw]">
          <ChatBox props={{currentUser,selectedUser,socket,messages,setMessages}}/>
        </div>
      </div>
    </div>
    </>
  );
}

function Contacts(props) {
  let {currentUser,connectedUsers,setselectedUser,rerender} = props.props;
  if(connectedUsers==null) return;
  let elements = connectedUsers.map((user)=>{
      return (<div key={Math.random()*10000}>
        <div onClick={()=>{
          setselectedUser(user)
          alert(`Selected User : ${user.username}`)
        }} className="flex items-center bg-gray-700 gap-5 rounded-xl hover:scale-105 hover:bg-gray-800 duration-200 cursor-pointer">
          <div className="p-5 flex items-center"><img src={user.avatarUrl} alt="" className="rounded-full w-20 h-20 bg-green-600 border-black border-2 hover:scale-125 duration-200 ease-in-out cursor-pointer"/></div>
          <div className="text-white text-2xl">{user.username}</div>
        </div>
      
      </div>)
  })
  function addContact(e){
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    let new_username = data.username
    POST('/api/users/read',{username : new_username },(users) =>{
      if(users.length == 0){
        alert("Username not found!");
        return;
      }
      let user = users[0];

      currentUser.connections.push(user._id)
      currentUser['id'] = {_id : currentUser._id}
      POST('/api/users/update',currentUser,(success) =>{
        if(success){
          alert("User Updated!");
          rerender();
        }
        else{
          alert("Something went wrong!");
        }
      })
    })
    e.target.reset();
  }
  return (
    <div className="">
      <div className="text-2xl">Contacts</div>
      <form onSubmit={addContact} className="flex p-5 justify-center items-center">
        <div>
          <input type="text" name="username" className="p-3"/>
        </div>
        <button className="p-5 bg-blue-600 text-yellow-500 font-bold rounded-xl m-5 cursor-pointer">Add Contact</button>
      </form>
      <div className="bg-gray-600 rounded-xl p-5 flex flex-col gap-5">
        {elements}
      </div>
    </div>
  )
}

function ChatBox(props) {
  let {currentUser,selectedUser,socket,messages,setMessages} = props.props;

  let messageItems = messages.map((message)=>{
    let fromSelf = message.from == currentUser._id
    let user = fromSelf ? currentUser :selectedUser
    return(
      <div key={Math.random()*100000} className={`flex ${fromSelf ? 'flex-row-reverse' : ''}`}>
        <div className="p-5 flex flex-col text-white">
          <img src={user.avatarUrl} alt="" className="rounded-full w-10 h-10 bg-green-600 border-black border-2 hover:scale-125 duration-200 ease-in-out cursor-pointer"/>
          <div>{user.username}</div>
          </div>
        <div>
        <div className={`bg-${fromSelf?'blue':'green'}-600 p-5 text-white text-xl rounded-xl`}>{message.message}</div>
        </div>
        
      </div>
    )
  })
  if(currentUser==null || selectedUser==null) return;
  function sendMessage(e){
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    let message = data.message
    let obj = {
      message : message,
      from :currentUser._id,
      to : selectedUser._id
    }
    socket.emit('sendMessage',obj)
    setMessages(prev=>[...prev,obj])
    e.target.reset();
  }
  return (
    <div className="">
      <div className="text-2xl">Message {selectedUser.username}</div>
      <div className="bg-slate-600 p-5 h-[50vh] w-[50vw] overflow-y-scroll flex flex-col gap-5">
        {messageItems}
      </div>
      <form onSubmit={sendMessage} className="flex bg-gray-700 p-5 gap-5">
        <input type="text" name="message" className="p-3"/>
        <button className="text-white">Send message</button>
      </form>
    </div>
  )
}
function Navbar(props){
  let navigate = useNavigate();
  function logout(){
    localStorage.removeItem('user-data');
    navigate('/')
  }
  let {currentUser} = props.props;
  return (<>
  <div className="min-h-[10vh] bg-slate-700 flex items-center justify-between">
    <div className="flex gap-5 items-center">
      <div className="p-5 flex items-center"><img src={currentUser.avatarUrl} alt="" className="rounded-full w-20 h-20 bg-green-600 border-black border-2 hover:scale-125 duration-200 ease-in-out cursor-pointer"/></div>
      <div className="text-white text-2xl">Logged In as,<span className='block text-blue-400'>{currentUser.username}</span></div>
    </div>
    <div onClick={logout} className="p-5 text-red-600 text-3xl hover:scale-125 duration-200 cursor-pointer">Logout</div>
  </div>
  </>)
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
