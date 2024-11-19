import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import postsReducer from './slices/postsSlice';
import authReducer from "./slices/authSlice";
import feedReducer from './slices/feedSlice';
import postReducer from "./slices/postSlice";
import categoryReducer from './slices/categorySlice';
import approvalReducer from './slices/approvalSlice';
import flagReducer from './slices/flaggingSlice';







const store = configureStore({
  reducer: {
    users: userReducer,
    posts: postsReducer,
    auth: authReducer,
    feed: feedReducer,
    post: postReducer,
    categories:categoryReducer,
    approvals:approvalReducer,
    flags:flagReducer
  },
});

export default store;
