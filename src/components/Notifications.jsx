import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { crossIcon, tickIcon } from "./icons";
import { ENDPOINT } from "./Utils";
import { useDispatch } from "react-redux";
import { acceptRejectFriendRequest, cancelFriendRequest } from "./redux/userSlice";
import { ToastContainer, toast } from "react-toastify";

export default function Notifications() {
    let [requests,setRequests] = useState([]);
    let my_user =  useSelector(reducers=>reducers.auth.user);
    
    useEffect(()=>{
        axios.get(ENDPOINT(`/users/requests/read/${my_user._id}`)).then((res)=>{
            setRequests(res.data);
        })
    },[])

    let requestElements = requests.map((request,i)=>{
        return <RequestUser key={i} props={{request,my_user}}/>
    })
  return (
    <div className="w-full h-full bg-black p-5">
        <div className="text-white text-5xl hurricane my-5">Notifications</div>
        <div className="flex flex-col gap-5 overflow-y-auto">
            {requestElements}
        </div>
        <ToastContainer/>
    </div>
  )
}

function RequestUser(props){
    let {request,my_user} = props.props;
    let requester = request.requester
    let dispatch = useDispatch();
    function cancelRequest(){
        dispatch(cancelFriendRequest({senderId : my_user._id ,receiverId :requester._id })).then((res)=>{
          if(res.payload.error == undefined) {
            toast.success(res.payload.message);
          }
          else {  
            toast.error(res.payload.error)
          }
        })
      }
    function acceptRejectRequest(acceptReject){
        dispatch(acceptRejectFriendRequest({senderId : my_user._id ,receiverId :requester._id ,acceptReject})).then((res)=>{
            if(res.payload.error == undefined) {
              toast.success(res.payload.message);
            }
            else {  
              toast.error(res.payload.error)
            }
        })
    }
    return (<>
    <div className="flex gap-5 items-center">
        <img
                src={`https://robohash.org/${requester.email}`}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full border-[1px] border-gray-500"
            />
        <div className="flex flex-col">
            <div className='text-white'>@{requester.username}</div>
            <div className='text-gray-500 text-sm'>{request.type} request</div>
        </div>
        {request.type == 'incoming' ? 
        <div className="flex gap-5">
            <div onClick={()=>acceptRejectRequest("accepted")}
            className="text-white flex gap-2 bg-green-600 px-5 py-2 rounded-xl hover:bg-green-700 cursor-pointer">
                <div className="text-black ">Accept</div>
                <div>{tickIcon}</div>
            </div>
            <div onClick={()=>acceptRejectRequest("rejected")}
            className="text-white flex gap-2 bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 cursor-pointer">
                <div>Reject</div>
                <div>{crossIcon}</div>
            </div>
        </div>
        :
        <div>
            <div onClick = {cancelRequest} 
            className="text-white">{request.status}</div>
        </div>
        }
    </div>

    </>)
}