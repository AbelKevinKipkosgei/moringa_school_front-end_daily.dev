import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:5555/api/admin/allusers'); // API call to get all users
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to toggle activation status
export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:5555/api/admin/reactivateuser`, { userId, isActive });
      return { userId, isActive: response.data.isActive }; // Return userId and updated status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Async thunk to deactivate a user
export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5555/api/admin/deactivateuser`, { userId }
      );
      return { userId, isActive: false };  // assuming response has `isActive: false`
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, isActive } = action.payload;
        const user = state.users.find((user) => user.id === userId);
        if (user) {
          user.isActive = isActive;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const userReducer = userSlice.reducer;
export default userReducer;
