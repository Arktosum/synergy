import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../app/axios'
import { AxiosError } from 'axios'
import { Socket } from 'socket.io-client'

const REGISTER_ENDPOINT = '/auth/register'
const LOGIN_ENDPOINT = '/auth/login'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user : {username: string,email:string,password: string,},{ rejectWithValue }) => {
    try{
      const response = await axios.post(REGISTER_ENDPOINT,user);
      return response.data
    }
    catch(err : unknown){
     const ERROR = err as AxiosError 
     return rejectWithValue(ERROR.response?.data);
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (user : {email: string, password: string},{ rejectWithValue }) => {
    try{
      const response = await axios.post(LOGIN_ENDPOINT,user);
      return response.data
    }
    catch(err : unknown){
     const ERROR = err as AxiosError 
     return rejectWithValue(ERROR.response?.data);
    }
  },
)

export const testUser = createAsyncThunk(
  'auth/testUser',
  async (_,{ rejectWithValue }) => {
    try{
      const response = await axios.get('/auth/test');
      return response.data
    }
    catch(err : unknown){
     const ERROR = err as AxiosError 
     return rejectWithValue(ERROR.response?.data);
    }
  },
)

export interface AuthState {
  user_id : string | null,
  socket : Socket | null
}
const initialState: AuthState = {
  user_id : localStorage.getItem('user-id'),
  socket : null,
}
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) =>{
      state.user_id = null;
      localStorage.removeItem('user-id');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled,(state,action)=>{
      state.user_id = action.payload._id;
      localStorage.setItem('user-id', action.payload._id);
    })
  }
})

// Action creators are generated for each case reducer function
export const { logoutUser} = authSlice.actions

export default authSlice.reducer