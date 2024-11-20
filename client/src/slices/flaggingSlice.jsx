import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Flag a specific post
export const flagPost = createAsyncThunk(
  'flags/flagPost',
  async (post_id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/api/posts/flag/${post_id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(error.message || 'Failed to flag the post');
      }
      return { post_id, flagged: true }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Unflag a specific post
export const unflagPost = createAsyncThunk(
  'flags/unflagPost',
  async (post_id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/api/posts/unflag/${post_id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return { post_id, flagged: false }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const flaggingSlice = createSlice({
  name: 'flags',
  initialState: {
    flaggedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Flag post
      .addCase(flagPost.fulfilled, (state, action) => {
        const { post_id } = action.payload;
        if (!state.flaggedPosts.find((post) => post.post_id === post_id)) {
          state.flaggedPosts.push(action.payload); // Add the flagged post to the list
        }
      })
      // Unflag post
      .addCase(unflagPost.fulfilled, (state, action) => {
        state.flaggedPosts = state.flaggedPosts.filter(
          (post) => post.post_id !== action.payload.post_id  // Remove the post from the flagged posts
        );
      })
      // Handle loading and error states for async actions
      .addCase(flagPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(flagPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unflagPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unflagPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setError } = flaggingSlice.actions;
export default flaggingSlice.reducer;
