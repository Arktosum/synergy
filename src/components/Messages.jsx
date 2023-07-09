import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { readRoom } from "./redux/userSlice";

export default function Messages() {
  return (
    <div className='h-full bg-black w-full flex overflow-hidden'>
      <ContactBox/>
      <MessageBox/>
      <ToastContainer/>
    </div>
  )
}

function ContactBox(){
  let [pattern,setPattern] = useState("");
  let [users,setUsers] = useState([]);
  let user = useSelector(reducers=>reducers.auth.user);
  useEffect(()=>{
    if(!pattern){
      setUsers([]);
      return;
    }
    // axios.get(ENDPOINT(`/users/search/${pattern}`)).then((res)=>{
    //   res.data = res.data.filter((x)=>x._id != user._id)
    //   setUsers(res.data)
    // })
  },[pattern])
  let userElements = users.map((user,i)=>{
    return <User key={i} props={{user}}/>
  })
  return (<>
    <div className="w-[40%] h-full bg-[#131313] p-5">
      <div className='text-white text-5xl hurricane mx-auto'>Contacts</div>
        <div className='my-5 w-full'>
          <input value={pattern} onChange={(e)=>{setPattern(e.target.value)}}
          type="text" className="text-white bg-inherit border-[1px] border-gray-600 w-full py-1 rounded-sm p-2"/>
        </div>
        <hr />
        <div className='w-full h-full flex flex-col gap-5 overflow-auto'>
          {userElements.length == 0 ? <>
          <div className='text-gray-600 text-sm mx-auto my-auto'>Try making some friends!</div>
          </>:userElements}
        </div>
      </div>
  </>)
}


function User(props){
  let {user} = props.props;
  return (<>
        <Link to={`/profile/${user._id}`}>
          <div className='flex items-center gap-5 hover:bg-[#232323] duration-200 p-2 rounded-xl cursor-pointer'>
            <img src={`https://robohash.org/${user.email}`}
            className='w-10 h-10 rounded-full border-[1px] border-gray-600'
            alt="" />
          <div className='text-white text-sm'>@{user.username}</div>
          </div>
        </Link>
    </>)
}
function MessageBox(){
  const { roomId } = useParams();
  let dispatch = useDispatch();
  let user = useSelector(reducers=>reducers.auth.user);
  let socket = useSelector(reducers=>reducers.socket);
  console.log(socket);
  let [room,setRoom] = useState(null);

  let [message,setMessage] = useState('');
  useEffect(()=>{
    dispatch(readRoom(roomId)).then((res)=>{
      setRoom(res.payload.room)
    })
  },[])
  function sendMessage(){
    if(message=='') return;

  }
  if(!room){
    return (<div className="w-full h-full bg-black flex flex-col">
      <div className="text-gray-600 mx-auto my-auto">Talk to a person!</div>
    </div>)
  }
  let otherUser = room.participants.filter(x=>x._id != user._id)[0]
  let messagesEle = room.messages.map((message,i)=>{
    return <Message key={i} props={{message,user,otherUser}}/>
  })
 
  return (<>
    <div className="w-full h-full bg-black flex flex-col">
      <div>
          <div className='flex items-center gap-5 p-2'>
            <img src={`https://robohash.org/${otherUser.email}`}
            className='w-20 h-20 rounded-full border-[1px] border-gray-600'
            alt="" />
          <Link to={`/profile/${otherUser._id}`}><div className='text-white text-sm'>@{otherUser.username}</div></Link>
          </div>
      </div>
      <hr />
      <div className="my-auto flex flex-col gap-5">
        {messagesEle}
      </div>
      <div className='w-full self-end'>
          <input onKeyDown={(e)=>{
            if(e.key == "Enter") sendMessage();
          }}
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          type="text" className="text-white bg-inherit border-[1px] border-gray-600 w-full py-1 rounded-sm p-2"/>
      </div>
    </div>
  </>)
}

function Message(props){
  let {message,user,otherUser} = props.props;
  let self = message.from == user._id
  let MESSAGE_SENDER = self? user:  otherUser
  return (<>
    <div className={`text-white px-5 w-fit rounded-xl py-2 ${self ? 'self-end bg-[#131313]' : 'self-start bg-[#3A3A3A]'}`}>
      <div>${MESSAGE_SENDER.username}</div> 
      <div>Yo</div> 
    </div> 
  </>)
}