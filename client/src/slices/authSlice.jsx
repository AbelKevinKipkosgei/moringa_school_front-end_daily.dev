import { createSlice } from "@reduxjs/toolkit";

const tokenKey = "authToken";

const initialState = {
  isLoggedIn: !!localStorage.getItem(tokenKey), // Determine initial login state based on token presence
  userRole: localStorage.getItem("userRole") || null, // Retrieve user role from local storage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, role } = action.payload;
      localStorage.setItem(tokenKey, token); // Save token to local storage
      localStorage.setItem("userRole", role); // Save role to local storage
      state.isLoggedIn = true;
      state.userRole = role;
    },
    logout(state) {
      localStorage.removeItem(tokenKey); // Remove token from local storage
      localStorage.removeItem("userRole"); // Remove role from local storage
      state.isLoggedIn = false;
      state.userRole = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
