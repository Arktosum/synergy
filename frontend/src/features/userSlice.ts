import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../app/axios'
import { AxiosError } from 'axios'

const FETCH_USER_ENDPOINT = '/user'


export const fetchUserbyId = createAsyncThunk(
  'user/fetchUserbyId',
  async (user_id : string ,{ rejectWithValue }) => {
    try{
      const response = await axios.get(FETCH_USER_ENDPOINT+"/"+user_id);
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
    builder.addCase(fetchUserbyId.fulfilled,(state,action)=>{
      state.user = action.payload;
    })
  }
})



export default userSlice.reducer