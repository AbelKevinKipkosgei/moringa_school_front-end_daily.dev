import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Function to get the token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }
  return token;
};


// Flag a specific post
// Flag a specific post
export const flagPost = createAsyncThunk(
  'flags/flagPost',
  async ({ post_id, reason }, { dispatch, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`http://127.0.0.1:5555/api/posts/flag/${post_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }), 
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Update Redux state to include flagged post
      dispatch(addFlaggedPost(data));  // Dispatch action to add flagged post

      return data;
    } catch (error) {
      console.error('Error flagging post:', error);
      return rejectWithValue(error.message || 'Failed to flag post');
    }
  }
);

// Unflag a specific post
export const unflagPost = createAsyncThunk(
  'flags/unflagPost',
  async (post_id, { dispatch, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`http://127.0.0.1:5555/api/posts/unflag/${post_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Update Redux state to remove unflagged post
      dispatch(removeFlaggedPost(post_id));  // Dispatch action to remove flagged post

      return data;
    } catch (error) {
      console.error('Error unflagging post:', error);
      return rejectWithValue(error.message || 'Failed to unflag post');
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
    addFlaggedPost: (state, action) => {
      // Prevent adding duplicate flagged posts
      if (!state.flaggedPosts.find(post => post.post_id === action.payload.post_id)) {
        state.flaggedPosts.push(action.payload);
      }
    },
    removeFlaggedPost: (state, action) => {
      // Remove unflagged post from the array
      state.flaggedPosts = state.flaggedPosts.filter(
        post => post.post_id !== action.payload
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(flagPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(flagPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(flagPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unflagPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unflagPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(unflagPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addFlaggedPost, removeFlaggedPost, setError } = flaggingSlice.actions;
export default flaggingSlice.reducer;