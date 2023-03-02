import React, { useState } from 'react'
import { useNavigate } from 'react-router';

let addFriendSvg = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
<path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
</svg>)
export default function Sidebar(props) {
    let {chatRooms,currentUser,selectedChat,setSelectedChat} = props.props
    let [showModal,setShowModal] = useState(false)
    let navigate = useNavigate();
    let rooms = chatRooms.map((room)=>{
        let user = room.users[0]._id == currentUser._id ? room.users[1] : room.users[0]
        return (
        <div onClick={()=>{
            setSelectedChat(room);
        }} key={user._id} className={`
        flex items-center ${selectedChat && room._id == selectedChat._id ? 'bg-[#4c029b]' : 'border-2 border-[#380172]'} gap-5 rounded-full 
        cursor-pointer hover:bg-[#4c029b] duration-300`}>
            <img src={user.avatarUrl} alt="" className='w-12 h-12 rounded-full bg-green-600 border-2 border-black'/>    
            <div className='text-white text-xl font-bold'>{user.username}</div>    
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
        {showModal ? <Modal props={{setShowModal}}/> : <></>}
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

function Modal(props){
    let {setShowModal} = props.props
    return(<>
    <div className='fixed bg-[#00000093] h-screen w-screen flex justify-center items-center'>
        <div className='border-2 border-green-600 w-[50vh] h-[80vh]'>
            <div onClick={()=>{setShowModal(false)}} className='text-white text-2xl bg-blue-600 cursor-pointer'>Cancel</div>
        </div>
    </div>
    </>)
}