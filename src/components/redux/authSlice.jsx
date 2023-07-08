import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const loginUser = createAsyncThunk('auth/login', async (userData) => {
  try {
    const response = await axios.post('http://localhost:3000/users/login', userData)
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData) => {
  try {
    const response = await axios.post('http://localhost:3000/users/register', userData)
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const readUser = createAsyncThunk('auth/read', async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${id}`)
    return response.data;
  } catch (error) {
    return error.message;
  }
});
const authSlice = createSlice({
  name: 'auth',
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
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('USER_ID',action.payload.userId);
        state.user = action.payload;
      })
      .addCase(readUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
  },
});

export default authSlice.reducer;
export const { logoutUser } = authSlice.actions;