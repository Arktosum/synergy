// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import socketReducer from './socketSlice';
import io from 'socket.io-client';


const store = configureStore({
  reducer: {
    auth: authReducer,
    user : userReducer,
    socket : io('http://localhost:3000/')
  },
  // Add any additional middleware here
});

export default store;
