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
export const flagPost = createAsyncThunk(
  'flags/flagPost',
  async ({post_id,reason} ,{  rejectWithValue }) => {
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

      // Check if the response is OK
      if (!response.ok) {
        // Throw an error with the response's status text
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the response body as JSON
      const data = await response.json();

      // Log the API response
      console.log('API Response:', data);

      // Return the data (for Redux to handle)
      return data;
    } catch (error) {
      // Log and return the error message if something went wrong
      console.error('Error flagging post:', error);
      return rejectWithValue(error.message || 'Failed to flag post');
    }
  }
);

// Unflag a specific post
export const unflagPost = createAsyncThunk(
  'flags/unflagPost',
  async (post_id, {  rejectWithValue }) => {
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

      // Check if the response is OK
      if (!response.ok) {
        // Throw an error with the response's status text
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the response body as JSON
      const data = await response.json();

      // Log the API response
      console.log('API Response:', data);

      // Return the data (for Redux to handle)
      return data;
    } catch (error) {
      // Log and return the error message if something went wrong
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
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(flagPost.fulfilled, (state, action) => {
        const { post_id ,reason} = action.payload;
        // Prevent duplicate flagged posts
        if (!state.flaggedPosts.find((post) => post.post_id === post_id)) {
          state.flaggedPosts.push(action.payload);
        }
      })
      .addCase(unflagPost.fulfilled, (state, action) => {
        state.flaggedPosts = state.flaggedPosts.filter(
          (post) => post.post_id !== action.payload.post_id
        );
      })
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
