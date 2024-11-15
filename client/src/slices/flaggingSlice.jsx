// flaggingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Flag a post as inappropriate
export const flagPost = createAsyncThunk(
  'posts/flagPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:5555/api/admin/flagpost`, { postId });
      return { postId, flagged: response.data.flagged };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove a post
export const removePost = createAsyncThunk(
  'posts/removePost',
  async (postId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://127.0.0.1:5555/api/admin/removepost/${postId}`);
      return postId; // Return the removed post's ID for updating the state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const flaggingSlice = createSlice({
  name: 'flagging',
  initialState: {
    flaggedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(flagPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(flagPost.fulfilled, (state, action) => {
        state.loading = false;
        const post = state.flaggedPosts.find((p) => p.id === action.payload.postId);
        if (post) post.flagged = action.payload.flagged;
      })
      .addCase(flagPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.flaggedPosts = state.flaggedPosts.filter((p) => p.id !== action.payload);
      });
  },
});

export const flaggingReducer = flaggingSlice.reducer;
export default flaggingReducer;
