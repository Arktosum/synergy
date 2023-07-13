import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {io} from 'socket.io-client'
import { ENDPOINT } from '../Utils';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
      socket: io(ENDPOINT(''))
    },
    reducers: {

    },
    // extraReducers: (builder) => {
    //   builder.addCase(updateUser.fulfilled,(state,action)=>{
    //     state.user = action.payload
    //   })
    // },
  });
  
  export default socketSlice.reducer;
//   export const { connectSocket } = socketSlice.actions;