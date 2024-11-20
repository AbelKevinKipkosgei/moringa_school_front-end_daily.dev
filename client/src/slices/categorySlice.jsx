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



export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({name,description} ,{  rejectWithValue }) => {
    try {
      // Get the access token from the Redux store
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No access token found');
      }

     
      const response = await fetch('http://localhost:4000/api/categories/createcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
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
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false; // Set loading state to false
        state.error = action.payload; // Set error message
      });
  },
});

export default categorySlice.reducer; 
