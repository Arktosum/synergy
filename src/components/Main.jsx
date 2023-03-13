import React, { useEffect, useRef,useState } from 'react'
import './App.css';
import {styles} from './styles'
import { ORIGIN, POST } from './Utils';
import {useNavigate} from 'react-router-dom'
import {io} from 'socket.io-client'
import Sidebar from './Sidebar';
import Content from './Content';

const socket = io(ORIGIN)
export default function Main() {
    let user_id = localStorage.getItem('user-data');
    let navigate = useNavigate();
    console.log("Main rendered")
    setTimeout(()=>{
        if(user_id == null) {
            navigate('/')
        }
    },100)
    let [currentUser,setCurrentUser] = useState(null);
    let [renderState,setRender] = useState(false);
    let [selectedChat,setSelectedChat] = useState(null);
    
    let [chatRooms,setChatRooms] = useState([]);
    function forceRender(){
        setTimeout(()=>{
            setRender(prev=>!prev);
        },300)
    }
    
    useEffect(()=>{
        POST('/api/users/read',{_id:user_id},(users)=>{
            let user = users[0];
            setCurrentUser(user);
            POST('/api/groups/read',{users:user_id},(chats)=>{
                setChatRooms(chats);
            })
        })
    },[renderState])
  if(currentUser == null) return;
  return (<>
  <div className='h-screen bg-black'>
    <div className='h-screen flex'>
        <div className="bg-slate-900 w-[20vw]">
            <Sidebar props={{chatRooms,currentUser,socket,selectedChat,setSelectedChat,forceRender}}/>
        </div>
        <div className="bg-gray-800 w-[80vw]">
            <Content props={{selectedChat,socket,currentUser}}/>
        </div>
    </div>
  </div>
  </>
  )
}
