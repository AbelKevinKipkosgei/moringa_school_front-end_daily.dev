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

// Approve a post
export const approvePost = createAsyncThunk(
  'approvals/approvePost',
  async (post_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}}/api/posts/approve/${post_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        // Throw an error with the response's status text
        throw new Error(`Error: ${response.statusText}`);
      }

      
      const data = await response.json();

      

      
      return data;
    } catch (error) {
      
      console.error('Error approving post:', error);
      return rejectWithValue(error.message || 'Failed to approve post');
    }
  }
);

// Delete a post
export const deletePost = createAsyncThunk(
  'approvals/deletePost',
  async (post_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/admin/post/delete/${post_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        // Throw an error with the response's status text
        throw new Error(`Error: ${response.statusText}`);
      }

      
      const data = await response.json();

      

      
      return data;
    } catch (error) {
      
      console.error('Error deleting post:', error);
      return rejectWithValue(error.message || 'Failed to delete post');
    }
  }
);

// Flag a specific post
export const flagPost = createAsyncThunk(
  'flags/flagPost',
  async ({ post_id, reason }, { dispatch, rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/posts/flag/${post_id}`, {
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
      

      
      dispatch(addFlaggedPost(data));  

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

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/posts/unflag/${post_id}`, {
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
      
      
      dispatch(removeFlaggedPost(post_id));  

      return data;
    } catch (error) {
      console.error('Error unflagging post:', error);
      return rejectWithValue(error.message || 'Failed to unflag post');
    }
  }
);

const approvalSlice = createSlice({
  name: 'approvals',
  initialState: {
    approvedPosts: [],
    flaggedPosts: [],  // Add flaggedPosts state
    loading: false,
    error: null,
  },
  reducers: {
    setApprovedPosts: (state, action) => {
      state.approvedPosts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addFlaggedPost: (state, action) => {
      if (!state.flaggedPosts.find(post => post.id === action.payload.id)) {
        state.flaggedPosts.push(action.payload);
      }
    },
    removeFlaggedPost: (state, action) => {
      state.flaggedPosts = state.flaggedPosts.filter(
        post => post.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approvePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePost.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedPosts = state.approvedPosts.map((post) =>
          post.id === action.payload.post_id
            ? { ...post, approved: action.payload.approved }
            : post
        );
      })
      .addCase(approvePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedPosts = state.approvedPosts.filter(
          (post) => post.id !== action.payload.post_id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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

export const { setApprovedPosts, setLoading, setError, addFlaggedPost, removeFlaggedPost } = approvalSlice.actions;
export default approvalSlice.reducer;