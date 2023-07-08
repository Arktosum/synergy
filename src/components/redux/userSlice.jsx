import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const sendFriendRequest = createAsyncThunk('user/read', async (userData) => {
  try {
    const response = await axios.post(`http://localhost:3000/users/send`,userData)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null
  },
  reducers: {
    logoutUser: (state)=>{
      state.user = null
      localStorage.removeItem('USER_ID');
    }
  },
  extraReducers: (builder) => {
  },
});

export default userSlice.reducer;
export const { logoutUser } = userSlice.actions;