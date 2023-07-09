// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import socketReducer from './socketSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user : userReducer,
    socket : socketReducer
  },
  // Add any additional middleware here
});

export default store;
