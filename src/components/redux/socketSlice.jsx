import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
      socket: null
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