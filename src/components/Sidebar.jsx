/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from './redux/authSlice';
import { homeIcon,logoutIcon,messageIcon,notificationIcon,profileIcon,searchIcon } from './icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINT } from './Utils';

const Sidebar = () => {
  let dispatch = useDispatch();
  let user = useSelector(reducers=>reducers.auth.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selected,setSelected] = useState('profile');
  return (<>
    <div className="flex flex-col h-full w-[20vw] bg-[#131313] text-white">
      <div className='mx-auto text-5xl my-5 hurricane'>Synergy</div>
      <img src={`https://robohash.org/${user.email}`} className="w-20 h-20 rounded-full border-[1px] mx-auto border-gray-500" alt="" />
      <div className='mx-auto text-sm my-2 italic text-blue-300'>@{user.username}</div>
      <div></div>
      <div className='w-full flex flex-col gap-5 my-5 p-3'>
        <Link to="/"><div onClick={()=>{
          setSelected('home')
          setIsSearchOpen(false)}}
        className={`hover:bg-[#1D1D1D] w-full p-3 cursor-pointer duration-200 rounded-xl flex gap-5 ${selected == 'home' ? 'bg-[#1D1D1D]' : ''}`}>
          <span>{homeIcon}</span>
          <span>Home</span>
        </div></Link>
        <div onClick={()=>{
          setSelected('search')
          setIsSearchOpen(prev=>!prev)}}
        className={`hover:bg-[#1D1D1D] w-full p-3 cursor-pointer duration-200 rounded-xl flex gap-5 ${selected == 'search' ? 'bg-[#1D1D1D]' : ''}`}>
          <span>{searchIcon}</span>
          <span>Search</span>
        </div>
        <Link to="/messages"><div onClick={()=>{
          setSelected('messages')
          setIsSearchOpen(false)}}
        className={`hover:bg-[#1D1D1D] w-full p-3 cursor-pointer duration-200 rounded-xl flex gap-5 ${selected == 'messages' ? 'bg-[#1D1D1D]' : ''}`}>
          <span>{messageIcon}</span>
          <span>Messages</span>
        </div></Link>
        <Link to="/profile"><div onClick={()=>{
          setSelected('profile')
          setIsSearchOpen(false)}}
        className={`hover:bg-[#1D1D1D] w-full p-3 cursor-pointer duration-200 rounded-xl flex gap-5 ${selected == 'profile' ? 'bg-[#1D1D1D]' : ''}`}>
          <span>{profileIcon}</span>
          <span>Profile</span>  
        </div></Link>
        <Link to="/notifications"><div onClick={()=>{
          setSelected('notifications')
          setIsSearchOpen(false)}}
        className={`hover:bg-[#1D1D1D] w-full p-3 cursor-pointer duration-200 rounded-xl flex gap-5 ${selected == 'notifications' ? 'bg-[#1D1D1D]' : ''}`}>
          <span className='relative'>
            <span className='absolute -top-4 left-4 bg-red-600 rounded-full w-6 h-6 text-center px-1'>{user.requests.length}</span>
            {notificationIcon}
          </span>
          <span>Notifications</span>  

        </div></Link>
      </div>
      <div onClick={()=>dispatch(logoutUser())}
      className='mx-auto bg-red-600 px-5 py-2 rounded-xl hover:bg-[#c61e1e] cursor-pointer flex gap-2'>
        <span>{logoutIcon}</span>
        <span>Logout</span>
      </div>
    </div>
    {
    <div className={`${isSearchOpen ? 'slide-in' : 'slide-out'} w-[20vw] h-full bg-[#141414] border-l-[1px] border-l-gray-600 absolute left-[16.5%]`}>
      {isSearchOpen &&<Search/>}
    </div>
   }
    </>);
};

function Search() {
  let [pattern,setPattern] = useState("");
  let [users,setUsers] = useState([]);
  let user = useSelector(reducers=>reducers.auth.user);


  useEffect(()=>{
    if(!pattern){
      setUsers([]);
      return;
    }
    axios.get(ENDPOINT(`/users/search/${pattern}`)).then((res)=>{
      res.data = res.data.filter((x)=>x._id != user._id)
      setUsers(res.data)
    })
  },[pattern])
  
  let userElements = users.map((user,i)=>{
    return <User key={i} props={{user}}/>
  })
  return (
    <div className='w-full h-full p-3 flex flex-col items-center'>
      <div className='text-white text-5xl hurricane mx-auto'>Search</div>
      <div className='my-5 w-full'>
        <input value={pattern} onChange={(e)=>{setPattern(e.target.value)}}
        type="text" className="text-white bg-inherit border-[1px] border-gray-600 w-full py-1 rounded-sm p-2"/>
      </div>
      <hr />
      <div className='w-full h-full flex flex-col gap-5 overflow-auto'>
        {userElements.length == 0 ? <>
        <div className='text-gray-600 text-sm mx-auto my-auto'>Search for new friends!</div>
        </>:userElements}
      </div>
    </div>
  )
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
export default Sidebar;
