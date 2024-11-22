// categorySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Function to get the token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }
  return token;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({name,description} ,{  rejectWithValue }) => {
    try {
      
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

     
      const response = await fetch(`${backendUrl}/api/categories/createcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ name, description }),
      });

    const data = await response.json(); 
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return rejectWithValue(error.message || 'Failed to fetch categories');
  }
});
// Create the slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true; // Set loading state to true
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false
        state.categories.push(action.payload); // Add new category to the state
        state.success = true
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false; // Set loading state to false
        state.error = action.payload; // Set error message
        state.success = false
      });
  },
});

export default categorySlice.reducer; 
