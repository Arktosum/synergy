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
    setTimeout(()=>{
        if(user_id == null) {
            navigate('/')
        }
    },100)
    let [currentUser,setCurrentUser] = useState(null);
    let [renderState,setRender] = useState(false);
    let [fetchedUsers,setFetchedUsers] = useState([]);
    let [selectedChat,setSelectedChat] = useState(null);
    let [messages,setMessages] = useState([]);
    let [chatRooms,setChatRooms] = useState([]);
    let searchInput = useRef();
    
    useEffect(()=>{
        socket.on('connect',()=>{
         console.log("Connection established!");
         socket.on('receive-message',(message)=>{
            console.log("received")
            setMessages(prev=>[...prev,message])
            setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},200);
         })  
        })
     },[])

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
    function searchUser(){
        let name = searchInput.current.value
        if(name == ''){
            setFetchedUsers([])
            return;
        };
        POST('/api/users/read',{username:{
            $regex : name,$options : "i"
        }},(users)=>{
            setFetchedUsers(users)
        })
    }
    useEffect(()=>{
        if(selectedChat == null) return;
        POST('/api/messages/read',{to:selectedChat._id},(messages)=>{
            setMessages(messages)
        })
    },[selectedChat])
    function selectChat(other_id){
        POST('/api/groups/read',{
            users : {$all : [user_id,other_id]}
        },(chats)=>{
            if(chats.length == 0){
                alert("No chat found! Creating an new one!");
                POST('/api/groups/create',{users : [user_id,other_id]},(chat)=>{
                    setSelectedChat(chat);
                    socket.emit('join-room',chat);
                    setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},500);
                })
            }
            else{
                alert("chat found!");
                let chat = chats[0];
                setSelectedChat(chat);
                socket.emit('join-room',chat);
                setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},500);
            }
        })
    }
    function createGroup(){
        // [ID of people in the group]
        // [includingYOU,54j4j23jh32,123u1h32h123j,j2311j32n]

        let ids = []
        POST('/api/groups/create',{
            chatName : groupName,
            users : ids
        })
    }
    
  if(currentUser == null) return;
  return (<>
  <div className='h-screen bg-black'>
    <div className='h-screen flex'>
        <div className="bg-slate-900 w-[20vw]">
            <Sidebar props={{chatRooms,currentUser,selectedChat,setSelectedChat}}/>
        </div>
        <div className="bg-gray-800 w-[80vw]">
            <Content props={{messages,setMessages,selectedChat,socket,currentUser}}/>
        </div>
    </div>
  </div>
  </>
  )
}
