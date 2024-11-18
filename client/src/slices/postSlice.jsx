import { createSlice } from "@reduxjs/toolkit";

// Initial state for the post slice
const initialState = {
  post: null,
  isLoading: false,
  error: null,
};

// Create the slice with reducers and actions
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchPostStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },
    fetchPostFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const { fetchPostStart, fetchPostSuccess, fetchPostFailure } =
  postSlice.actions;

// Export the reducer
export default postSlice.reducer;

// Thunk to fetch post by ID
export const fetchPostById = (postId) => async (dispatch) => {
  try {
    dispatch(fetchPostStart());

    // Fetch post from API without checking if the user is logged in
    const response = await fetch(`/api/post/read/${postId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    const data = await response.json();
    dispatch(fetchPostSuccess(data.post)); // Save the fetched post to Redux state
  } catch (error) {
    dispatch(fetchPostFailure(error.message));
  }
};
