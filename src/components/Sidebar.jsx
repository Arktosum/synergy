import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { POST } from './Utils';

let addFriendSvg = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
</svg>)
export default function Sidebar(props) {
    let {chatRooms,currentUser,socket,selectedChat,setSelectedChat,forceRender} = props.props
    let [showModal,setShowModal] = useState(false)
    let [modalType,setmodalType] = useState("friend")
    let [fetchedUsers,setFetchedUsers] = useState([]);
    let navigate = useNavigate();
    console.log(chatRooms)
    let rooms = chatRooms.map((room)=>{
        let is_dm = room.users.length ==2
        let user
        if(is_dm)
            user = room.users[0]._id == currentUser._id ? room.users[1] : room.users[0]
        return (
        <div onClick={()=>{
            setSelectedChat(room);
            socket.emit('join-room',room);
        }} key={room._id} className={`
        flex items-center ${selectedChat && room._id == selectedChat._id ? 'bg-[#4c029b]' : 'border-2 border-[#380172]'} gap-5 rounded-full 
        cursor-pointer hover:bg-[#4c029b] duration-300`}>
            <img src={is_dm?user.avatarUrl:""} alt="" className='w-12 h-12 rounded-full bg-green-600 border-2 border-black'/>    
            <div className='text-white text-xl font-bold'>{is_dm?user.username:room.chatName}</div>    
        </div>
        )
    })
    function Logout(){
        localStorage.removeItem('user-data');
        alert("Logged out!");
        navigate('/')
    }
  return (
    <div className='flex flex-col justify-center'>
        {showModal ? <Modal props={{setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType}}/> : <></>}
        <div className='h-[10vh] flex items-center p-5'>
            <div className='border-purple-600 border-2 p-2 text-purple-600 rounded-xl text-sm font-bold
            hover:bg-purple-600 hover:text-white hover:font-bold cursor-pointer duration-200
            ' onClick={()=>{setShowModal(true)}}>ADD FRIEND {addFriendSvg}</div>
        </div>
        <div className='flex flex-col gap-3 p-5 h-[60vh] overflow-y-auto'>
            {rooms}
        </div>
        <div className="h-[30vh]">
            <div className='relative flex justify-start p-5 gap-5 items-center h-full'>
                <img src={currentUser.avatarUrl} alt="" className='w-20 h-20 rounded-full bg-green-600 border-2 border-black'/>
                <div className='text-cyan-600 text-xl'>
                    <div>{currentUser.username}</div>
                    <div className='text-sm text-green-600 flex gap-2 items-center'>
                    <div className='w-1 h-1 bg-green-600 rounded-full'></div>
                    <div>Online</div>
                    </div>
                </div>
                <div className='absolute bottom-1 right-1'>
                    <div onClick={Logout} className='text-red-600 text-2xl font-bold cursor-pointer hover:scale-105 duration-200'>Logout</div>
                </div>
            </div>
        </div>
    </div>
  
  )
}

function searchUser(name,currentUser,setFetchedUsers){
    if(name == ''){
        setFetchedUsers([])
        return;
    };
    POST('/api/users/read',{username:{
        $regex : name,$options : "i",$ne:currentUser.username
    }},(users)=>{
        setFetchedUsers(users)
    })
}

function Modal(props){
    let {setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType} = props.props
    function addUser(user_id){
        // Creates a new chat room with the specified user
        // if it already exists, joins his room.
        // Otherwise creates a new one.
        POST("/api/groups/read",{users : {$all : [user_id,currentUser._id]}},(groups)=>{
            if(groups.length==0){
                POST('/api/groups/create',{users : [user_id,currentUser._id]},(group)=>{
                    // created a new chatroom!
                    alert("create a new chatroom")
                    setShowModal(false);
                    setSelectedChat(group)
                    socket.emit('join-room',group);
                    forceRender()
                })
            }else{
                alert("Already exists!")
                 // Already exists;
                 setShowModal(false);
                 setSelectedChat(groups[0])
                 socket.emit('join-room',groups[0]);
                 forceRender()
            }
            setFetchedUsers([])
            
        })
    }
    function addGroup(groupUsers,chatName){
        let all_ids = [currentUser._id]
        groupUsers.forEach((user)=>{
            all_ids.push(user._id)
        })
        POST("/api/groups/read",{users : {$all : all_ids}},(groups)=>{
            if(groups.length==0){
                POST('/api/groups/create',{users : all_ids,chatName:chatName},(group)=>{
                    // created a new chatroom!
                    alert("create a new chatroom")
                    setShowModal(false);
                    setSelectedChat(group)
                    socket.emit('join-room',group);
                    forceRender()
                })
            }else{
                alert("Already exists!")
                 // Already exists;
                //  setShowModal(false);
                //  setSelectedChat(groups[0])
                //  socket.emit('join-room',groups[0]);
                //  forceRender()
            }
        
        })
    }
    return(<>
    <div className='fixed bg-[#00000093] h-screen w-screen flex justify-center items-center'>
        {modalType == "friend" ? <FriendModal props={{setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType,addUser}}/> : 
                                    <GroupModal props={{setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType,addGroup}}/>}
    </div>
    </>)
}
function FriendModal(props){
    let {setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType,addUser} = props.props
    return(
        <div className='rounded-xl w-[50vh] h-[80vh]'>
            <div className='h-[50%] w-full p-5'>
                <div className='bg-[#737272] rounded-full delay-700'>
                    <input type="text" onChange={(e)=>{searchUser(e.target.value,currentUser,setFetchedUsers)}} className="appearance-none h-10 w-full bg-inherit rounded-full focus:outline-none px-5"/>
                </div>
                <div className='rounded-2xl h-[50vh] overflow-y-auto my-5'>
                    {fetchedUsers.map((user)=>{
                        return(<div onClick={()=>{addUser(user._id)}} key={user._id} className="p-5 flex items-center gap-5 bg-[#1f243e] hover:bg-[#15192b] duration-200 cursor-pointer">
                            <img src={user.avatarUrl} alt="" className='w-10 h-10 rounded-full bg-green-600 border-black border-2'/>
                            <div className='text-white text-xl'>{user.username}</div>
                        </div>)})}
                </div>
            </div>
            <div className='h-[50%] w-full flex justify-center items-end p-5'>
                <div onClick={()=>{setmodalType("group")}} className='text-xl text-white bg-[#6ac019a4] rounded-xl px-5 py-2 hover:scale-[1.2] duration-200 cursor-pointer'>Add Group</div>
                <div onClick={()=>{setShowModal(false);setFetchedUsers([])}} className='text-xl text-white bg-[#ff00004b] rounded-xl px-5 py-2 hover:scale-[1.2] duration-200 cursor-pointer'>CANCEL</div>
            </div>
        </div>
    )
}
function GroupModal(props){
    let {setShowModal,setFetchedUsers,fetchedUsers,currentUser,setSelectedChat,socket,forceRender,modalType,setmodalType,addGroup} = props.props
    let [groupUsers,setgroupUsers] = useState([])
    let [groupName,setgroupName] = useState([])

    return(
        <div className='rounded-xl w-[50vh] h-[80vh]'>
            <div className='h-[50%] w-full p-5'>
                <div className='bg-[#737272] rounded-full delay-700'>
                    <input type="text" onChange={(e)=>{searchUser(e.target.value,currentUser,setFetchedUsers)}} className="appearance-none h-10 w-full bg-inherit rounded-full focus:outline-none px-5"/>
                </div>
                <div>
                    {
                        groupUsers.map((user)=>{
                            return (<div key={user._id}>
                                <div className="bg-gray-600 rounded-xl flex gap-5 p-2">
                                    <img src={user.avatarUrl} alt="" className='w-5 h-5 rounded-full border-black border-2'/>
                                    <div className="text-white text-sm italic">{user.username}</div>
                                </div>
                                
                            </div>)
                        })
                    }
                </div>
                <div className='rounded-2xl h-[50vh] overflow-y-auto my-5'>
                    {fetchedUsers.map((user)=>{
                        return(<div onClick={()=>{setgroupUsers((prev=>{
                            let found = false
                            prev.forEach(groupUser=>{
                                if(groupUser._id == user._id){
                                    found = true;
                                }
                            })
                            if(found){
                                return prev.filter(u=>u._id != user._id)
                            }else{
                               return [...prev,user]
                            }
                        }))}}
                            key={user._id} className="p-5 flex items-center gap-5 bg-[#1f243e] hover:bg-[#15192b] duration-200 cursor-pointer">
                            <img src={user.avatarUrl} alt="" className='w-10 h-10 rounded-full bg-green-600 border-black border-2'/>
                            <div className='text-white text-xl'>{user.username}</div>
                        </div>)})}
                </div>
            </div>
            <div className='h-[50%] w-full flex justify-center items-end p-5'>
            <div className='text-5xl text-white'>
            <input type="text" onChange={(e)=>{setgroupName(e.target.value)}} className='text-black'/>
            <div onClick={()=>{setmodalType("friend")}} className='text-xl text-white bg-[#6ac019a4] rounded-xl px-5 py-2 hover:scale-[1.2] duration-200 cursor-pointer'>Add Friend</div></div>
            <div onClick={()=>{setShowModal(false);setFetchedUsers([]);setgroupUsers([])}} className='text-xl text-white bg-[#ff00004b] rounded-xl px-5 py-2 hover:scale-[1.2] duration-200 cursor-pointer'>CANCEL</div>
            <div onClick={()=>{addGroup(groupUsers,groupName);setShowModal(false);setFetchedUsers([]);setgroupUsers([])}} className='text-xl text-white bg-[#6fff004b] rounded-xl px-5 py-2 hover:scale-[1.2] duration-200 cursor-pointer'>Create</div>
            </div>
        </div>
    )
}