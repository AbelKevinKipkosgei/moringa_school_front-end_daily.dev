import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Function to refresh the access token
const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    console.log('No refresh token found. Redirecting to login...');
    navigate('/login');
    return null;
  }

  try {
    const response = await fetch('http://localhost:5555/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      console.error('Failed to refresh access token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    navigate('/login');
    return null;
  }
};

// Fetch users with automatic token refresh on 401 error
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue, getState }) => {
  let token = localStorage.getItem('access_token');
  
  if (!token) {
    console.log('No access token found. Redirecting to login...');
    return rejectWithValue('No access token');
  }

  try {
    let response = await fetch('http://localhost:5555/api/admin/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh...');
      token = await refreshAccessToken();
      if (!token) return rejectWithValue('Failed to refresh access token');

      // Retry fetching the users with the new token
      response = await fetch('http://localhost:5555/api/admin/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

// Deactivate user
export const deactivateUser = createAsyncThunk('users/deactivateUser', async (user_id, { rejectWithValue, getState }) => {
  let token = localStorage.getItem('access_token');
  
  if (!token) {
    console.log('No access token found. Redirecting to login...');
    return rejectWithValue('No access token');
  }

  try {
    let response = await fetch(`http://localhost:5555/api/admin/user/deactivate/${user_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh...');
      token = await refreshAccessToken();
      if (!token) return rejectWithValue('Failed to refresh access token');

      // Retry deactivating the user with the new token
      response = await fetch(`http://localhost:5555/api/admin/user/deactivate/${user_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error('Failed to deactivate user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deactivating user:', error);
    return rejectWithValue(error.message || 'Failed to deactivate user');
  }
});

// Reactivate user
export const activateUser = createAsyncThunk('users/activateUser', async (user_id, { rejectWithValue, getState }) => {
  let token = localStorage.getItem('access_token');
  
  if (!token) {
    console.log('No access token found. Redirecting to login...');
    return rejectWithValue('No access token');
  }

  try {
    let response = await fetch(`http://localhost:5555/api/admin/user/reactivate/${user_id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh...');
      token = await refreshAccessToken();
      if (!token) return rejectWithValue('Failed to refresh access token');

      // Retry reactivating the user with the new token
      response = await fetch(`http://localhost:5555/api/admin/user/reactivate/${user_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error('Failed to activate user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error activating user:', error);
    return rejectWithValue(error.message || 'Failed to activate user');
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