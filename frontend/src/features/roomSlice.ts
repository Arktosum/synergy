import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../app/axios'
import { AxiosError } from 'axios'

const CREATE_ROOM_ENDPOINT = '/room'


export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (payload : {participants : User[],admins : User[] } ,{ rejectWithValue }) => {
    try{
      const response = await axios.post(CREATE_ROOM_ENDPOINT+"/create",payload);
      return response.data
    }
    catch(err : unknown){
     const ERROR = err as AxiosError 
     return rejectWithValue(ERROR.response?.data);
    }
  },
)

export interface User{
  _id : string,
  username: string,
  password: string
  email : string
}

export interface UserState {
  user: User | null,
}

const initialState: UserState = {
    user : null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(createRoom.fulfilled,(state,action)=>{
        console.log("Room created",action.payload)
    })
  }
})



export default userSlice.reducer