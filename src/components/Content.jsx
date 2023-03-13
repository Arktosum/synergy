import React, { useEffect, useRef, useState } from 'react'
import { POST } from './Utils';

export default function Content(props) {
  let messageBox = useRef();
  let [messages,setMessages] = useState([])
  let {selectedChat,socket,currentUser} = props.props
  useEffect(()=>{
    if(selectedChat == null) return;
    console.log('got all messages')
    POST('/api/messages/read',{to:selectedChat._id},(messages)=>{
        setMessages(messages)
        setTimeout(()=>{
          if(messageBox.current) messageBox.current.scrollTop = messageBox.current.scrollHeight
        },200);  
    })
  },[selectedChat])

  useEffect(()=>{
    socket.off('receive-message').on('receive-message',(message)=>{
      console.log('received message')
      setMessages(prev=>[...prev,message])
      setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},200);
    })  
  },[])
  
  



  function sendMessage(message){
    if(message == '') return;
    let messageObj = {
        content : message,
        from : currentUser._id,
        to : selectedChat._id
    }
    POST('/api/messages/create', messageObj,(message)=>{
        setMessages(prev=>[...prev, message])
        socket.emit('send-message',message);
        setTimeout(()=>{messageBox.current.scrollTop = messageBox.current.scrollHeight},200);
    })
  }
  let Messages = messages.map((message)=>{
    return <Message key ={message._id} props={{message}}/>
  })
  if(selectedChat == null) return (<NoChat/>)
  return (<>
    <div>
      <div ref={messageBox} className='h-[80vh] overflow-y-auto space-y-5'>
        {Messages}
      </div>
      <div className='h-[20vh] flex items-center justify-center'>
        <div className='bg-[#1b1f31] w-full m-5 p-5 rounded-xl'>
          <input onKeyDown={(e)=>{
            if(e.key == 'Enter'){sendMessage(e.target.value);e.target.value = ``}
          }} type="text" placeholder={`Message anything!`} name="message" className="w-full appearance-none bg-inherit focus:outline-none text-white"/>
        </div>
      </div>
    </div>
  </>)
}

function Message(props){
  let {message} = props.props
  let user = message.from
  let createdAt = message.createdAt

  let newDate = new Date(createdAt).toLocaleString()
  // let [date,time] = createdAt.split('T')
  // let[hour,min,rest] = time.split(":")
  // let [year,month,day] = date.split("-")
  // let hourMin = `${day}/${month}/${year} ${hour}:${min}`



  return (<>
  <div className='flex gap-5 hover:bg-[#253141] duration-300 py-2 px-5'>
    <img src={user.avatarUrl} alt="" className='w-10 h-10 rounded-full bg-green-600 border-2 border-black'/>
    <div>
      <div className='text-white italic'>{user.username}<span className='px-5 text-sm text-gray-500'>{newDate}</span></div>
      <div className="text-white text-lg">{message.content}</div>
    </div>
  </div>
  </>)
}

function NoChat(){

  return(<><div className='h-[80vh] text-white text-lg flex justify-center items-center font-extrabold'>
    Hey there!, Don't you have any friends to talk to?
    </div></>)
}