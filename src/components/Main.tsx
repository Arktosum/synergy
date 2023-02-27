import React, { useEffect, useState } from 'react'
import './App.css';
import {styles} from './styles'
import { POST } from './Utils';
import {Link,useNavigate} from 'react-router-dom'

export default function Main() {
    let user_id = localStorage.getItem('user-data');
    let navigate = useNavigate();
    if(user_id == null) {
        navigate('/')
    }
    let [currentUser,setCurrentUser] = useState(null);
    let [renderState,setRender] = useState(false);
    function forceRender(){
        setTimeout(()=>{
            setRender(prev=>!prev);
        },300)
    }
    function Logout(){
        localStorage.removeItem('user-data');
        alert("Logged out!");
        navigate('/')
    }
    useEffect(()=>{
        POST('/api/users/read',{_id:user_id},(users)=>{
            let user = users[0];
            setCurrentUser(user);
        })
    },[renderState])
  if(currentUser == null) return;
  console.log(currentUser)
  return (<>
  <div className='min-h-screen bg-black'>
    <div className="flex bg-slate-800 p-5 justify-evenly items-center"> 
        <div className="flex items-center gap-5 flex-1">
            <img src={currentUser.avatarUrl} alt="" className='w-20 h-20 bg-green-600 rounded-full border-black border-2 hover:scale-105 duration-200 ease-in-out cursor-pointer'/>
            <div className='text-white text-xl'>Logged in as,<span className='text-blue-500'>{currentUser.username}</span></div>
        </div>
        <div onClick={Logout} className='text-red-500 text-2xl hover:scale-105 cursor-pointer duration-200'>Logout</div>
    </div>
    <div className='grid grid-cols-2'>
        <div className='bg-gray-700 p-5'>
            <div>Contacts</div>
            <div>{currentUser.connections.map((item)=>{
                console.log(item);
                return <></>
            })}</div>
        </div>
        <div className='bg-slate-600 p-5'></div>
    </div>
  </div>
  </>
  )
}

/*
START
user has to [SIGNUP]. -> Create a new <User>    - DONE
if user already signed up, [LOGIN] -> Check if <User> exists, and send them <User>.  - DONE

Fetch all <Chat> where user is in. - PREREQ

Single chat
Find a <User> (can use regex to find multiple people and click on the one we want) - WORKING
then check if a single chat <Chat> with them exists. if not , make a new <Chat>

User SELECTS or "CLICKS" a <Chat> Which gives an chat_id.
once Selected, fetch ALL messages with that chat_id


SOCKET-IO - Emit join-room and join with chat_id


Outgoing messages are sent from user and to the chat_id
Incoming messages are sent from other user and to the chat_id

END
*/