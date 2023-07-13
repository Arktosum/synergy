import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINT } from '../Utils';


export const sendFriendRequest = createAsyncThunk('user/read', async (userData) => {
  try {
    const response = await axios.post(ENDPOINT('/users/requests/send'),userData)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const cancelFriendRequest = createAsyncThunk('user/read', async (userData) => {
  try {
    const response = await axios.post(ENDPOINT('/users/requests/cancel'),userData)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});
export const acceptRejectFriendRequest = createAsyncThunk('user/read', async (userData) => {
  try {
    const response = await axios.post(ENDPOINT('/users/requests/acceptReject'),userData)
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});
export const updateUser = createAsyncThunk('user/read', async (userData) => {
  try {
    const response = await axios.get(ENDPOINT(`/users/${userData}`))
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const fetchRoom = createAsyncThunk('user/read', async (participants) => {
  try {
    const response = await axios.post(ENDPOINT('/rooms/fetch'),{participants})
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const readRoom = createAsyncThunk('user/read', async (roomId) => {
  try {
    const response = await axios.get(ENDPOINT(`/rooms/${roomId}`))
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
    builder.addCase(updateUser.fulfilled,(state,action)=>{
      state.user = action.payload
    })
  },
});

export default userSlice.reducer;
export const { logoutUser } = userSlice.actions;