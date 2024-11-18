import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import signUpReducer from './slices/signUpSlice';
import logInReducer from './slices/logInSlice';
import feedReducer from './slices/feedSlice';


const store = configureStore({
  reducer: {
    users: userReducer,
    signUp: signUpReducer,
    logIn: logInReducer,
    feed: feedReducer,
  },
});

export default store;
