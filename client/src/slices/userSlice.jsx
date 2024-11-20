import { createSlice, createAction,createAsyncThunk } from '@reduxjs/toolkit';

const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }
  return token;
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (token, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:5555/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (user_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(
        `http://localhost:5555/api/admin/user/deactivate/${user_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }

      const data = await response.json();

      
      
      return { user_id };
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred while deactivating the user.");
    }
  }
);

// Activate user
export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (user_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

      const response = await fetch(
        `http://localhost:5555/api/admin/user/reactivate/${user_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate user");
      }

      const data = await response.json();

      // Return user_id to update the state later
      
      return { user_id, activated: user.activated };
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred while activating the user.");
    }
  }
);
export const updateUserStatus = createAction('users/updateUserStatus');

const userReducer = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    message: null, // Add this to hold success/error messages
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const { user_id, status ,message} = action.payload;
        const updatedUsers = state.users.map((user) =>
          user.id === user_id ? { ...user, activated:false } : user
        );
        state.users = updatedUsers;
        state.message = message || "User deactivated successfully!";  

      })
      .addCase(activateUser.fulfilled, (state, action) => {
        const { user_id, status,message } = action.payload;
        const updatedUsers = state.users.map((user) =>
          user.id === user_id ? { ...user, activated:true } : user
        );
        state.users = updatedUsers;
        state.message = message || "User activated successfully!";
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(updateUserStatus, (state, action) => {
        const { user_id, status } = action.payload;
        const updatedUsers = state.users.map((user) =>
          user.id === user_id ? { ...user, activated: true } : user
        );
        state.users = updatedUsers;
      });
  },
});

export const { setMessage } = userReducer.actions;
export default userReducer.reducer;


