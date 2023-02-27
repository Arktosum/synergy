import React from 'react'
import './App.css';
import {styles} from './styles'
import { POST } from './Utils';
import {Link,useNavigate} from 'react-router-dom'

export default function Signup() {
    let navigate = useNavigate()
    function createUser(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let {username,password,retypePassword,email} = Object.fromEntries(new FormData(e.target));
        e.target.reset()
        if(password !== retypePassword){
            alert("Passwords do not match!");
            return;
        }
        let userData = {
            username : username,
            password : password,
            email : email,
            avatarUrl : `https://robohash.org/${username}`
        }
        POST('/api/users/exists',{username:username},(data)=>{
            if(data.length > 0){
                alert("Someone with that username already exists!");
                return;
            }
            POST('/api/users/create',userData,(user)=>{
                alert("Created a new user successfully!");
                localStorage.setItem('user-data',user._id);
                navigate('/chat')
            })
        })
        console.log(userData);
        
    }
  return (
    <div className='bg-black min-h-screen flex justify-center items-center flex-col'>
        <div className='m-5 text-5xl text-bold text-yellow-400 text-left'>Signup</div>
        <div className='bg-slate-600 p-5 rounded-xl'>
            <form onSubmit={(e)=>{createUser(e)}} className='grid grid-cols-2 gap-5 p-5'>
                <label htmlFor="username" className='text-white text-xl'>Username: </label>
                <input type="text" name="username" autoComplete="username" className={styles.inputBox}/>
                <label htmlFor="email" className='text-white text-xl'>Email: </label>
                <input type="email" name="email" autoComplete="username" className={styles.inputBox} />

                <label htmlFor="password" className='text-white text-xl'>Password: </label>
                <input type="password" name="password" autoComplete="current-password" className={styles.inputBox}/>

                <label htmlFor="retypePassword" className='text-white text-xl'>Retype Password: </label>
                <input type="password" name="retypePassword" autoComplete="new-password" className={styles.inputBox}/>
                <div className='text-xl text-green-500'>Already registerd? <Link to="/" className="text-blue-500 underline">Login now!</Link></div>
                
                <button type="submit" className={styles.ikeaButton+' p-5 col-span-2'}>REGISTER</button>
            </form>
        </div>
    </div>
  )
}
