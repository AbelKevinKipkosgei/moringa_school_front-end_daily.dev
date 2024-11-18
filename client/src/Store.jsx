import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import signUpReducer from './slices/signUpSlice';
import logInReducer from './slices/logInSlice';
import postsReducer from './slices/postsSlice';
import authReducer from "./slices/authSlice";
import feedReducer from './slices/feedSlice';



const store = configureStore({
  reducer: {
    users: userReducer,
    signUp: signUpReducer,
    logIn: logInReducer,
    posts: postsReducer,
    auth: authReducer,
    feed: feedReducer,
  },
});

export default store;
