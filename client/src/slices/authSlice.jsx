import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "authToken";
const USER_ROLE_KEY = "userRole";
const USER_ID_KEY = "userId";
const PROFILE_PICTURE_KEY = "profilePicture";

const initialState = {
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY), // Check if token exists in localStorage
  userRole: localStorage.getItem(USER_ROLE_KEY) || null,
  userId: localStorage.getItem(USER_ID_KEY) || null,
  profilePicture: localStorage.getItem(PROFILE_PICTURE_KEY) || null,
  loading: false,
  error: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    login(state, action) {
      const { token, role, userId, profilePicture } = action.payload;

      // Save all necessary data to localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_ROLE_KEY, role);
      localStorage.setItem(USER_ID_KEY, userId);
      localStorage.setItem(PROFILE_PICTURE_KEY, profilePicture);

      // Update Redux state
      state.isLoggedIn = true;
      state.userRole = role;
      state.userId = userId;
      state.profilePicture = profilePicture;
    },

    logout(state) {
      // Remove data from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(PROFILE_PICTURE_KEY);

      // Update Redux state
      state.isLoggedIn = false;
      state.userRole = null;
      state.userId = null;
      state.profilePicture = null;
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
export const selectUserId = (state) => state.auth.userId;
export const selectUserPicture = (state) => state.auth.profilePicture;

export default authSlice.reducer;
