import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import postsReducer from './slices/postsSlice';
import authReducer from "./slices/authSlice";
import feedReducer from './slices/feedSlice';
import postReducer from "./slices/postSlice";



const store = configureStore({
  reducer: {
    users: userReducer,
    posts: postsReducer,
    auth: authReducer,
    feed: feedReducer,
    post: postReducer,
  },
});

export default store;
