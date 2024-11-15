// approvalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Approve a post
export const approvePost = createAsyncThunk(
  'posts/approvePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:5555/api/admin/approvepost`, { postId });
      return { postId, approved: response.data.approved };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reject a post
export const rejectPost = createAsyncThunk(
  'posts/rejectPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:5555/api/admin/rejectpost`, { postId });
      return { postId, approved: response.data.approved };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const approvalSlice = createSlice({
  name: 'approvals',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approvePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePost.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.approved = action.payload.approved;
      })
      .addCase(approvePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectPost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.approved = action.payload.approved;
      });
  },
});

export const approvalReducer = approvalSlice.reducer;
export default approvalReducer;
