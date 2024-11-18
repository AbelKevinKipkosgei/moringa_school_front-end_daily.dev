// categorySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the async thunk for creating a category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/categories/createcategory', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const data = await response.json();
      return data;  // Success - Return the category data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong'); // Return error message
    }
  }
);

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

export default categorySlice.reducer; // Export the reducer to be used in the store
