import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    flaggedPosts: [],
    approvedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFlaggedPosts(state, action) {
      state.flaggedPosts = action.payload;
    },
    setApprovedPosts(state, action) {
      state.approvedPosts = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setFlaggedPosts, setApprovedPosts, setLoading, setError } = postsSlice.actions;

export default postsSlice.reducer;
