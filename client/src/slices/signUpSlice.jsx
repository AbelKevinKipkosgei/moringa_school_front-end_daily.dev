import { createSlice } from "@reduxjs/toolkit";

const signUpSlice = createSlice({
  name: "signUp",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signupStart(state) {
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const { loginStart, loginSuccess, loginFailure, signupStart, signupSuccess, signupFailure } = signUpSlice.actions;
export default signUpSlice.reducer;