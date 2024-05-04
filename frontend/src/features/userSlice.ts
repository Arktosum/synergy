import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { ORIGIN } from '../app/utils'


interface User{
  _id? : string,
  username : string,
  email : string,
  password? : string
}

export interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null,
}


// createAsyncThunk<ReturnType,firstArgumentType>

export const loginUser = createAsyncThunk<User,{email:string,password:string}>('user/login', async (loginData , thunkApi) => {

  try{
      const response = await axios.post(`${ORIGIN}/users/login`,loginData);
      return response.data;
  }
  catch(err) {
      return thunkApi.rejectWithValue(err);
  }

})

export const logoutUser = createAsyncThunk('user/logout', async (_,thunkApi) => {

  try{
      const response = await axios.get(`${ORIGIN}/users/logout`);
      return response.data;
  }
  catch(err) {
      return thunkApi.rejectWithValue(err);
  }

})




export function isAuthorized(){
  const item = localStorage.getItem('user-id')
  return item != null;
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers(builder){
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.user = payload
      localStorage.setItem('user-id', JSON.stringify(state.user._id));
    })
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      localStorage.removeItem('user-id');
    })
  }
  
})
export default userSlice.reducer