import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import signUpReducer from './slices/signUpSlice';
import logInReducer from './slices/logInSlice';


const store = configureStore({
  reducer: {
    users: userReducer,
    signUp: signUpReducer,
    logIn: logInReducer,
  },
});

export default store;
