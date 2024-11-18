import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        posts: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        fetchPostsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchPostsSuccess(state, action) {
            state.isLoading = false;
            state.posts = action.payload;
        },
        fetchPostsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } = feedSlice.actions;
export default feedSlice.reducer;  // export the reducer