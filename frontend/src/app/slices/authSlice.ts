import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { ORIGIN } from "../../Utils"

const API_ROUTE = ORIGIN
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData) => {
    try {
      const response = await axios.post(API_ROUTE+'/register',userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to Register User!');
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/registerUser',
  async (userData:User) => {
    try {
      const response = await axios.post(API_ROUTE+'/login',userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to Login User');
    }
  }
)

export interface User{
  username: string,
  email: string,
  password: string,
  avatar?: string
  bio?: string
  followers?: User[],
  following?: User[],
}

interface AuthState {
  token : string | null
}

const initialState : AuthState = {
  token : ""
} 

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (_state , action : PayloadAction<{token: string}>)=> {
      console.log(action.payload.token);
    })
    builder.addCase(registerUser.fulfilled, (_state, action :  PayloadAction<User>) => {
      console.log(action.payload);
    })

  },
})

