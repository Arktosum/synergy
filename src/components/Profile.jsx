import axios from "axios";
import { useEffect, useState } from "react";
import {useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRoom, sendFriendRequest } from "./redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { ENDPOINT } from "./Utils";

// Contains profile pic and name
// options 
// posts and liked posts and other meta data
// if self id , show edit profile picture
// else send friend request
export default function Profile() {
  const { userId } = useParams();
  let navigate = useNavigate()
  let [viewUser,setviewUser] = useState(null);
  let my_user =  useSelector(reducers=>reducers.auth.user);
  let myProfile = userId == null || userId == my_user._id
  let dispatch = useDispatch();
  
  useEffect(()=>{
      if(!myProfile){
      axios.get(ENDPOINT(`/users/${userId}`)).then((res)=>{
        setviewUser(res.data);
      })
    }
  },[userId])
  if(myProfile){
    viewUser = my_user
  }
  if(!viewUser) return;
  let posts=  [];
  for(let i = 0 ; i< 30 ; i++){
    posts.push(`https://picsum.photos/200?random=${i}`)
  }
  let postElements = posts.map((url,i)=>{
    return (
      <div key={i} className="w-52 h-52">
        <img src={url} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-75"/>
      </div>
    )
  })
  function handleRequest(){
    dispatch(sendFriendRequest({senderId : my_user._id ,receiverId :viewUser._id })).then((res)=>{
      console.log(res.payload)
      if(res.payload.error == undefined) {
        toast.success(res.payload.message);
      }
      else {  
        toast.error(res.payload.error)
      }
    })
  }
  function messageUser(){
    let participants = [my_user._id,viewUser._id]
    dispatch(fetchRoom(participants)).then((res)=>{
      if(res.payload.error == undefined) {
        navigate(`/messages/${res.payload.room._id}`);
      }
      else {  
        toast.error(res.payload.error)
      }
    })
  }
  return (
    <div className="h-full bg-black w-full text-white overflow-auto">
      <div className="container flex flex-col items-center">
        <div className="top flex  items-center gap-10 my-10">
          <img
            src={`https://robohash.org/${viewUser.email}`}
            alt="Profile Picture"
            className="w-40 h-40 rounded-full border-[1px] border-gray-500"
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-5 items-center">
              <div className="text-3xl">@{viewUser.username}</div>
              {myProfile ?
               <>
               <div className="text-white cursor-pointer">Settings</div>
               </> 
               : 
               <> 
               <div onClick={handleRequest}
                className="text-white cursor-pointer bg-blue-500 px-5 py-2 rounded-xl hover:bg-blue-600 duration-200">
                  Send Request
                </div>
                <div onClick={messageUser}
                className="text-black cursor-pointer bg-white px-5 py-2 rounded-xl hover:bg-[#bababa] duration-200">
                  Message
                </div>
               </>}
            </div>
            <div className="flex gap-5">
              <div>1 post</div>
              <div>1 friends</div>
            </div>
          </div>
        </div>
        <div className="border-gray-600 border-[1px] w-[50vw]"/>
        <div className="bottom grid grid-cols-3 my-10 p-5 gap-5 min-h-full">
          {postElements}
        </div>
        <ToastContainer />
      </div>
    </div>
  );

}
