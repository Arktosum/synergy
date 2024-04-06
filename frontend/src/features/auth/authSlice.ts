import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../app/axios'
import { AxiosError } from 'axios'
import { User } from '../user/userSlice'

const REGISTER_ENDPOINT = '/auth/register'
const LOGIN_ENDPOINT = '/auth/login'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user : User,{ rejectWithValue }) => {
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
  token: string | null,
  user_id : string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user_id : localStorage.getItem('user-id')
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) =>{
      state.token = null;
      state.user_id = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.rejected, (state, action ) => {
    })
    builder.addCase(registerUser.fulfilled, (state, action ) => {

    })
    builder.addCase(loginUser.fulfilled,(state,action)=>{
      state.token = action.payload.token;
      state.user_id = action.payload.user._id;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user-id', action.payload.user._id);
    })
  }
})

// Action creators are generated for each case reducer function
export const { logoutUser } = authSlice.actions

export default authSlice.reducer