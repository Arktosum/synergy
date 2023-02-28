import React, { useEffect, useRef,useState } from 'react'
import './App.css';
import {styles} from './styles'
import { POST } from './Utils';
import {Link,useNavigate} from 'react-router-dom'
import {io} from 'socket.io-client'

const socket = io('http://localhost:3000')
export default function Main() {
    let user_id = localStorage.getItem('user-data');
    let navigate = useNavigate();
    if(user_id == null) {
        navigate('/')
    }

    let [currentUser,setCurrentUser] = useState(null);
    let [renderState,setRender] = useState(false);
    let [fetchedUsers,setFetchedUsers] = useState([]);
    let [selectedChat,setSelectedChat] = useState(null);
    let [messages,setMessages] = useState([]);
    let [chatRooms,setChatRooms] = useState([]);
    let searchInput = useRef();
    let messageBox = useRef();
    useEffect(()=>{
        socket.on('connect',()=>{
         console.log("Connection established!"); 
         socket.on('receive-message',(message)=>{
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
    function Logout(){
        localStorage.removeItem('user-data');
        alert("Logged out!");
        navigate('/')
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
                })
            }
            else{
                alert("chat found!");
                let chat = chats[0];
                setSelectedChat(chat);
                socket.emit('join-room',chat);
            }
        })
    }

    function sendMessage(e){
        e.preventDefault();
        let {message} = Object.fromEntries(new FormData(e.target));
        let messageObj = {
            content : message,
            from : user_id,
            to : selectedChat._id
        }
        POST('/api/messages/create', messageObj,(message)=>{
            setMessages(prev=>[...prev, message])
            socket.emit('send-message',message);
            setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},200);
        })
        
        e.target.reset()
    }
  if(currentUser == null) return;
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
            <div className='text-white text-2xl m-2'>Search</div>
            <input type="text" ref={searchInput} onInput={searchUser} className={styles.inputBox}/>
            <div className='flex flex-col gap-5 p-5'>{
                fetchedUsers.map((user) =>{
                    return (<div key={user._id} onClick={()=>{
                        alert("Selected user " + user.username);
                        selectChat(user._id);
                        
                    }} className='flex items-center gap-5 bg-slate-500 rounded-xl p-2 hover:scale-105 duration-200 cursor-pointer'>
                        <img src={user.avatarUrl} alt="" className='w-20 h-20 bg-green-600 rounded-full border-black border-2 hover:scale-105 duration-200 ease-in-out cursor-pointer'/>
                        <div className='text-2xl text-white font-bold'>{user.username}</div>
                    </div>)
                })}</div>
            
            <div className='text-white text-2xl m-2'>Chat Rooms</div>
            <div className='flex gap-5 flex-col'>{chatRooms.map((chatRoom)=>{
                let [a,b] = chatRoom.users
                let otherUser = a._id == currentUser._id ? b :a
                return (<div onClick={()=>{
                    setSelectedChat(chatRoom);
                    socket.emit('join-room',chatRoom);
                }}
                    key={chatRoom._id} className="bg-slate-500 p-5 rounded-xl flex items-center gap-5 hover:bg-slate-800 duration-200 cursor-pointer hover:scale-105">
                     <img src={otherUser.avatarUrl} alt="" className='w-20 h-20 bg-green-600 rounded-full border-black border-2 hover:scale-105 duration-200 ease-in-out cursor-pointer'/>
                    <div className='text-white text-2xl'>{otherUser.username}</div>
                </div>)
            })}</div>
        </div>
        <div className='bg-slate-900 p-5'>
            <div className='text-xl text-white font-bold'>Chat</div>
            <div ref={messageBox} className='bg-slate-600 h-[50vh] overflow-y-scroll p-5 flex flex-col gap-5'>{ 
                messages.map((message)=>{
                    let fromSelf = message.from._id == user_id
                    return (<Message key={message._id} props={{message,fromSelf}}/>)
                })
            }</div>
            <div className='p-5'>
                <form onSubmit={(e)=>{
                    sendMessage(e)
                }}className='grid grid-cols-1 gap-5'>
                    <input type="text" className={styles.inputBox} name="message"/>
                    <button className={styles.ikeaButton +' p-5'}>SEND</button>
                </form>
            </div>
        </div>
    </div>
  </div>
  </>
  )
}

function Message(props){
    let {message,fromSelf} = props.props
    return(<div className={`flex ${fromSelf ? 'flex-row-reverse bg-purple-600' : 'bg-blue-600' } items-center gap-5 rounded-xl p-5`}>
        <div>
        <img src={message.from.avatarUrl} alt="" className='w-10 h-10 bg-green-600 rounded-full border-black border-2 hover:scale-105 duration-200 ease-in-out cursor-pointer'/>
        <div className='text-white text-sm'>{message.from.username}</div>
        </div>
        <div className='text-white text-xl'>{message.content}</div>
    </div>)
}
/*
START
user has to [SIGNUP]. -> Create a new <User>    - DONE
if user already signed up, [LOGIN] -> Check if <User> exists, and send them <User>.  - DONE

Fetch all <Chat> where user is in. - DONE

Single chat
Find a <User> (can use regex to find multiple people and click on the one we want) - DONE
then check if a chat <Chat> with them exists. if not , make a new <Chat> - DONE

User SELECTS or "CLICKS" a <Chat> Which gives an chat_id. - DONE
once Selected, fetch ALL messages with that chat_id - DONE


SOCKET-IO - Emit join-room and join with chat_id


Outgoing messages are sent from user and to the chat_id - DONE
Incoming messages are sent from other user and to the chat_id - DONE

END
*/