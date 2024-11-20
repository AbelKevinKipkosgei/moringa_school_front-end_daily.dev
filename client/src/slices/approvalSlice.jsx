// approvalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Approve a post
export const approvePost = createAsyncThunk(
  'approvals/approvePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/api/posts/approve/${postId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return { postId, approved: data.approved }; // Return postId and approval status
    } catch (error) {
      return rejectWithValue(error.message); // Return error message
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
        const post = state.approvedPosts.find((p) => p.id === action.payload.postId);
        if (post) post.approved = action.payload.approved; // Mark post as approved
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
