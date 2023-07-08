import { useEffect } from 'react';
import Sidebar from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { readUser } from './redux/authSlice';
// Contains Side bar and Feed

export default function Home() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let user = useSelector(reducers=>reducers.auth.user);

  useEffect(()=>{
    let user_id = JSON.parse(localStorage.getItem('USER_ID'))
    if(!user_id) {navigate('/login');return;}
    if(user == null){
      dispatch(readUser(user_id))
    }
  },[dispatch,navigate,user])

  
  if(!user) return;
  return (<>
    <div className="h-screen flex ">
        <Sidebar/>
        <Outlet/>
    </div>
    </>)
}
