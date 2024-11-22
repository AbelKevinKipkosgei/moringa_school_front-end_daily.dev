import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  body: "",
  category: "",
  post_type: "blog",
  thumbnail: null,
  media_file: null,
  isLoading: false,
  error: null,
};

const createPostSlice = createSlice({
  name: "createPost",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setFormData, setLoading, setError, resetForm } =
  createPostSlice.actions;

export const createPostReducer = createPostSlice.reducer;

export default createPostSlice;
