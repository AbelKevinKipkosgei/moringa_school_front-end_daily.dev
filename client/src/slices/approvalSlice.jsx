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
  async (post_id, {rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(`http://127.0.0.1:5555/api/posts/approve/${post_id}`, {
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

      // Parse the response body as JSON
      const data = await response.json();

      // Log the API response
      console.log('API Response:', data);

      // Return the data (for Redux to handle)
      return data;
    } catch (error) {
      // Log and return the error message if something went wrong
      console.error('Error approving post:', error);
      return rejectWithValue(error.message || 'Failed to approve post');
    }
  }
);

const approvalSlice = createSlice({
  name: 'approvals',
  initialState: {
    approvedPosts: [],
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
      });
  },
});

export const { setApprovedPosts, setLoading, setError } = approvalSlice.actions;
export const approvalReducer = approvalSlice.reducer;
export default approvalReducer;
