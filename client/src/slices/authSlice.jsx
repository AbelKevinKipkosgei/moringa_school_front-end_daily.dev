import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "authToken";
const USER_ROLE_KEY = "userRole";

const initialState = {
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY), // Check if token exists in localStorage
  userRole: localStorage.getItem(USER_ROLE_KEY) || null,
  loading: false,
  error: null,
  userInfo: null, // To store user info after successful signup
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    login(state, action) {
      const { token, role } = action.payload;
      localStorage.setItem(TOKEN_KEY, token); // Save token to local storage
      localStorage.setItem(USER_ROLE_KEY, role); // Save role to local storage
      state.isLoggedIn = true;
      state.userRole = role;
    },
    logout(state) {
      localStorage.removeItem(TOKEN_KEY); // Remove token from local storage
      localStorage.removeItem(USER_ROLE_KEY); // Remove role from local storage
      state.isLoggedIn = false;
      state.userRole = null;
    },
    refreshToken(state, action) {
      const { newToken } = action.payload;
      localStorage.setItem(TOKEN_KEY, newToken); // Update token in local storage
    },

    // Signup actions
    signupStart(state) {
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload; // Store user data after successful signup
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Store error message if signup fails
    },
  },
});

export const {
  login,
  logout,
  refreshToken,
  signupStart,
  signupSuccess,
  signupFailure,
} = authSlice.actions;

// Selector to get user role from Redux state
export const selectUserRole = (state) => state.auth.userRole;

export default authSlice.reducer;
