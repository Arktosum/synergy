import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/userSlice'
import financeSlice from '../features/financeSlice'
import friendSlice from '../features/friendSlice'

export const store = configureStore({
  reducer: {
    user : userSlice,
    finance : financeSlice,
    friend  :friendSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch