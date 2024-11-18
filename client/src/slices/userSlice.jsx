import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:5555/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json(); // Parse the response body as JSON
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});
export const deactivateUser = createAsyncThunk('users/deactivateUser', async (user_id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:5555/api/admin/user/deactivate/${user_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to deactivate user');
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Something went wrong');
  }
});

export const activateUser = createAsyncThunk('users/activateUser', async (user_id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:5555/api/admin/user/reactivate/${user_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to activate user');
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Something went wrong');
  }
});


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
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user.id === action.payload.id ? { ...user, activated: false } : user
        );
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user.id === action.payload.id ? { ...user, activated: true } : user
        );
      });
  },
});

export const userReducer = userSlice.reducer;