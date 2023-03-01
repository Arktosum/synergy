import React from 'react'
import './App.css';
import {styles} from './styles'
import { POST } from './Utils';
import {Link,useNavigate} from 'react-router-dom'

export default function Login() {
    let navigate = useNavigate();
    let user_id = localStorage.getItem('user-data');
    setTimeout(()=>{
        if(user_id != null) {
            navigate('/chat')
        }
    },100)
    
    function authenticateUser(e) {
        e.preventDefault();
        let {username,password} = Object.fromEntries(new FormData(e.target));
        e.target.reset()
        POST('/api/users/read',{username:username,password:password},(users)=>{
            if(users.length === 0) {
                alert("Invalid Credentials!");
                return;
            }
            alert("Logged in successfully!")
            localStorage.setItem('user-data',users[0]._id);
            navigate('/chat');
        })
    }
  return (
    <div className='bg-black min-h-screen flex justify-center items-center flex-col'>
        <div className='m-5 text-5xl text-bold text-yellow-400 text-left'>Login</div>
        <div className='bg-slate-600 p-5 rounded-xl'>
            <form onSubmit={(e)=>{authenticateUser(e)}} className='grid grid-cols-2 gap-5 p-5'>
                <label htmlFor="username" className='text-white text-xl'>Username: </label>
                <input type="text" name="username" autoComplete="username" className={styles.inputBox}/>
                <label htmlFor="password" className='text-white text-xl'>Password: </label>
                <input type="password" name="password" autoComplete="current-password" className={styles.inputBox}/>
                <div className='text-xl text-green-500'>New to Synergy? <Link to="/signup" className="text-blue-500 underline">Signup now!</Link></div>
                <button type="submit" className={styles.ikeaButton+' p-5 col-span-2'}>LOGIN</button>
            </form>
        </div>
    </div>
  )
}
